-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "gender" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "ssn" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "doctorId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "MedicalHistory" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "MedicalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Illness" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "medicalHistoryId" INTEGER NOT NULL,

    CONSTRAINT "Illness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "medicalHistoryId" INTEGER NOT NULL,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalTest" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "medicalHistoryId" INTEGER NOT NULL,

    CONSTRAINT "MedicalTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" SERIAL NOT NULL,
    "weight" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "medicalHistoryId" INTEGER NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" SERIAL NOT NULL,
    "doctorName" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "extraNotes" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drug" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "dose" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "medicalHistoryId" INTEGER NOT NULL,

    CONSTRAINT "Drug_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_ssn_key" ON "User"("ssn");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- AddForeignKey
ALTER TABLE "Illness" ADD CONSTRAINT "Illness_medicalHistoryId_fkey" FOREIGN KEY ("medicalHistoryId") REFERENCES "MedicalHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_medicalHistoryId_fkey" FOREIGN KEY ("medicalHistoryId") REFERENCES "MedicalHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalTest" ADD CONSTRAINT "MedicalTest_medicalHistoryId_fkey" FOREIGN KEY ("medicalHistoryId") REFERENCES "MedicalHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_medicalHistoryId_fkey" FOREIGN KEY ("medicalHistoryId") REFERENCES "MedicalHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drug" ADD CONSTRAINT "Drug_medicalHistoryId_fkey" FOREIGN KEY ("medicalHistoryId") REFERENCES "MedicalHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
