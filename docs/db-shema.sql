CREATE TABLE "profiles" (
  "userId" uuid PRIMARY KEY,
  "name" varchar,
  "createdAt" timestamp
);

CREATE TABLE "folders" (
  "id" uuid PRIMARY KEY,
  "name" varchar,
  "parentId" uuid,
  "createdAt" timestamp,
  "updatedAt" timestamp,
  "userId" uuid NOT NULL,
  "colorClass" varchar
);

CREATE TABLE "notes" (
  "id" uuid PRIMARY KEY,
  "title" varchar,
  "description" varchar,
  "content" text,
  "folderId" uuid,
  "createdAt" timestamp,
  "updatedAt" timestamp,
  "userId" uuid NOT NULL
);

ALTER TABLE "folders" ADD FOREIGN KEY ("parentId") REFERENCES "folders" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notes" ADD FOREIGN KEY ("folderId") REFERENCES "folders" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "folders" ADD FOREIGN KEY ("userId") REFERENCES "profiles" ("userId") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notes" ADD FOREIGN KEY ("userId") REFERENCES "profiles" ("userId") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;
