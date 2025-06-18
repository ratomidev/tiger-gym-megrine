-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "membershipNumber" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT,
    "tel" TEXT,
    "sexe" TEXT,
    "birthdate" TIMESTAMP(3),
    "photoUrl" TEXT,
    "inscriptionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriptionType" TEXT NOT NULL,
    "subscriptionStartDate" TIMESTAMP(3) NOT NULL,
    "subscriptionEndDate" TIMESTAMP(3) NOT NULL,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'actif',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Tunisie',
    "memberId" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceSubscription" (
    "id" TEXT NOT NULL,
    "musculation" BOOLEAN NOT NULL DEFAULT false,
    "cardio" BOOLEAN NOT NULL DEFAULT false,
    "fitness" BOOLEAN NOT NULL DEFAULT false,
    "boxing" BOOLEAN NOT NULL DEFAULT false,
    "yoga" BOOLEAN NOT NULL DEFAULT false,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "ServiceSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" TEXT NOT NULL,
    "medicalCertificateDate" TIMESTAMP(3),
    "hasMedicalCertificate" BOOLEAN NOT NULL DEFAULT false,
    "medicalCertificateUrl" TEXT,
    "allergies" TEXT,
    "healthIssues" TEXT,
    "specialPermissions" TEXT,
    "contraindications" TEXT,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_membershipNumber_key" ON "Member"("membershipNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Address_memberId_key" ON "Address"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceSubscription_memberId_key" ON "ServiceSubscription"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecord_memberId_key" ON "MedicalRecord"("memberId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceSubscription" ADD CONSTRAINT "ServiceSubscription_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
