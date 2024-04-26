-- CreateTable
CREATE TABLE "EMR" (
    "id" SERIAL NOT NULL,
    "age" INTEGER,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "bloodType" TEXT,
    "gender" TEXT,
    "patientId" INTEGER,

    CONSTRAINT "EMR_pkey" PRIMARY KEY ("id")
);
