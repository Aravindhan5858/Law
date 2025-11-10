-- CreateTable
CREATE TABLE "IPCSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "punishment" TEXT NOT NULL,
    "severity" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT
);

-- CreateTable
CREATE TABLE "Example" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ipcSectionId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    CONSTRAINT "Example_ipcSectionId_fkey" FOREIGN KEY ("ipcSectionId") REFERENCES "IPCSection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inputText" TEXT NOT NULL,
    "resultJson" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
