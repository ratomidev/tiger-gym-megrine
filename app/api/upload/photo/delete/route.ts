import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const photoUrl = searchParams.get("url");

    if (!photoUrl) {
      return NextResponse.json(
        { error: "Photo URL is required" },
        { status: 400 }
      );
    }

    // Delete photo from Vercel Blob
    await del(photoUrl);

    return NextResponse.json({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}
