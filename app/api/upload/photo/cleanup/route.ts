import { list, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Type for the specific Prisma query result
type AdherentWithPhotoUrl = {
  photoUrl: string | null;
};

/**
 * Clean up orphaned photos in blob storage
 * This endpoint finds photos in blob storage that are not referenced by any adherent
 */
export async function POST() {
  try {
    // Get all photos from blob storage
    const { blobs } = await list({ prefix: "photos/" });

    // Get all photoUrls from the database
    const adherents: AdherentWithPhotoUrl[] = await prisma.adherent.findMany({
      select: { photoUrl: true },
      where: { photoUrl: { not: null } },
    });

    const usedPhotoUrls = new Set(
      adherents.map((adherent) => adherent.photoUrl).filter(Boolean)
    );

    // Find orphaned photos
    const orphanedPhotos = blobs.filter((blob) => !usedPhotoUrls.has(blob.url));

    // Delete orphaned photos
    const deletionResults = await Promise.allSettled(
      orphanedPhotos.map((photo) => del(photo.url))
    );

    const successfulDeletions = deletionResults.filter(
      (result) => result.status === "fulfilled"
    ).length;
    const failedDeletions = deletionResults.filter(
      (result) => result.status === "rejected"
    ).length;

    return NextResponse.json({
      success: true,
      message: `Cleanup completed: ${successfulDeletions} photos deleted, ${failedDeletions} failures`,
      deleted: successfulDeletions,
      failed: failedDeletions,
      orphanedPhotos: orphanedPhotos.map((photo) => photo.url),
    });
  } catch (error) {
    console.error("Error during photo cleanup:", error);
    return NextResponse.json(
      { error: "Failed to cleanup photos" },
      { status: 500 }
    );
  }
}
