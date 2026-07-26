import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getAllProjects, getFeaturedProjects, createProject, deleteProject } from "@/lib/db";

// GET: Public - get featured projects, or Admin gets all
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && (session.user as any).role === "admin";

    const projects = isAdmin ? await getAllProjects() : await getFeaturedProjects();

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST: Admin only - create a new project
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { title, description, category, linkUrl, imageUrl, authorName } = await req.json();

    if (!title || !description || !category) {
      return NextResponse.json({ message: "Judul, deskripsi, dan kategori harus diisi" }, { status: 400 });
    }

    const project = await createProject({
      title,
      description,
      category,
      link_url: linkUrl,
      image_url: imageUrl,
      author_name: authorName,
    });

    return NextResponse.json({ message: "Project berhasil ditambahkan", project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE: Admin only
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const deleted = await deleteProject(id);

    if (!deleted) {
      return NextResponse.json({ message: "Project tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
