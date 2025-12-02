/*
  Warnings:

  - You are about to drop the `SavedJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `appliedAt` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `deadline` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `isRemote` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `responsibilities` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `salaryMax` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `salaryMin` on the `Job` table. All the data in the column will be lost.
  - Added the required column `jobseekerId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remote` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SavedJob_userId_jobId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SavedJob";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "jobseekerId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "initiatedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "viewedByHR" BOOLEAN NOT NULL DEFAULT false,
    "viewedByJobseeker" BOOLEAN NOT NULL DEFAULT false,
    "interestedAt" DATETIME,
    "contactedAt" DATETIME,
    "videoRequested" BOOLEAN NOT NULL DEFAULT false,
    "videoSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "videoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Match_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_jobseekerId_fkey" FOREIGN KEY ("jobseekerId") REFERENCES "JobseekerProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "jobId" TEXT,
    "matchId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "jobseekerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "coverLetter" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("coverLetter", "id", "jobId", "status", "updatedAt") SELECT "coverLetter", "id", "jobId", "status", "updatedAt" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE INDEX "Application_jobId_idx" ON "Application"("jobId");
CREATE INDEX "Application_jobseekerId_idx" ON "Application"("jobseekerId");
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "requiredSkills" TEXT,
    "experienceLevel" TEXT,
    "jobType" TEXT NOT NULL,
    "remote" TEXT NOT NULL,
    "minSalary" INTEGER,
    "maxSalary" INTEGER,
    "currency" TEXT DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("companyId", "createdAt", "description", "experienceLevel", "id", "jobType", "location", "status", "title", "updatedAt") SELECT "companyId", "createdAt", "description", "experienceLevel", "id", "jobType", "location", "status", "title", "updatedAt" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE TABLE "new_JobseekerProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "location" TEXT,
    "phone" TEXT,
    "skills" TEXT,
    "experience" TEXT,
    "education" TEXT,
    "resumeUrl" TEXT,
    "portfolioUrl" TEXT,
    "videoUrl" TEXT,
    "jobType" TEXT,
    "remote" TEXT,
    "minSalary" INTEGER,
    "maxSalary" INTEGER,
    "currency" TEXT DEFAULT 'USD',
    "availability" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "profileComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobseekerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_JobseekerProfile" ("bio", "createdAt", "experience", "id", "location", "portfolioUrl", "resumeUrl", "skills", "updatedAt", "userId") SELECT "bio", "createdAt", "experience", "id", "location", "portfolioUrl", "resumeUrl", "skills", "updatedAt", "userId" FROM "JobseekerProfile";
DROP TABLE "JobseekerProfile";
ALTER TABLE "new_JobseekerProfile" RENAME TO "JobseekerProfile";
CREATE UNIQUE INDEX "JobseekerProfile_userId_key" ON "JobseekerProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Match_jobId_idx" ON "Match"("jobId");

-- CreateIndex
CREATE INDEX "Match_jobseekerId_idx" ON "Match"("jobseekerId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_jobId_jobseekerId_key" ON "Match"("jobId", "jobseekerId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_recipientId_idx" ON "Message"("recipientId");

-- CreateIndex
CREATE INDEX "Message_jobId_idx" ON "Message"("jobId");
