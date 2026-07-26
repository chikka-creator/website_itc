import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getTasksByUserId, getAllTasks, createTask, deleteTask } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    // Admin melihat semua tugas, Member hanya miliknya sendiri
    const rawTasks = userRole === "admin" ? await getAllTasks() : await getTasksByUserId(userId);

    // Transform to match frontend expected format
    const tasks = rawTasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      linkUrl: t.link_url,
      createdAt: t.created_at,
      user: {
        name: t.user_name || "",
        email: t.user_email || "",
      }
    }));

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { title, description, linkUrl } = await req.json();

    if (!title || !description || !linkUrl) {
      return NextResponse.json({ message: "Semua field harus diisi" }, { status: 400 });
    }

    const newTask = await createTask(title, description, linkUrl, userId);

    return NextResponse.json(
      { message: "Tugas berhasil dikumpulkan", task: newTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

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

    const deleted = await deleteTask(id);

    if (!deleted) {
      return NextResponse.json({ message: "Tugas tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Tugas berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
