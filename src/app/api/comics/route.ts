import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "comics.json");

interface Comic {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
  featured: boolean;
}

async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function readComics(): Promise<Comic[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeComics(comics: Comic[]) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(comics, null, 2));
}

export async function GET() {
  const comics = await readComics();
  // Sort by date, newest first
  comics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return NextResponse.json(comics);
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const comics = await readComics();

    const newComic: Comic = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description || "",
      date: new Date().toISOString(),
      thumbnail: body.thumbnail,
      featured: body.featured || false,
    };

    comics.push(newComic);
    await writeComics(comics);

    return NextResponse.json(newComic);
  } catch (error) {
    console.error("Error creating comic:", error);
    return NextResponse.json({ error: "Failed to create comic" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const comics = await readComics();

    const index = comics.findIndex((c) => c.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    comics[index] = {
      ...comics[index],
      title: body.title,
      description: body.description || "",
      thumbnail: body.thumbnail,
      featured: body.featured || false,
    };

    await writeComics(comics);

    return NextResponse.json(comics[index]);
  } catch (error) {
    console.error("Error updating comic:", error);
    return NextResponse.json({ error: "Failed to update comic" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    const comics = await readComics();
    const filtered = comics.filter((c) => c.id !== id);

    if (filtered.length === comics.length) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    await writeComics(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comic:", error);
    return NextResponse.json({ error: "Failed to delete comic" }, { status: 500 });
  }
}
