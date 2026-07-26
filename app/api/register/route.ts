import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Semua field harus diisi" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password minimal 6 karakter" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await createUser(name, email, hashedPassword);

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
