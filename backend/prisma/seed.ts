// Use require to avoid potential TS export mismatches with the generated Prisma client
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { PrismaClient } = require('@prisma/client');
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

type SeedEntry = {
  id: number;
  title: string;
  text: string;
  punishment: string;
  tags: string[];
  examples: string[];
};

async function main() {
  const seedPath = path.resolve(__dirname, '..', 'data', 'ipc_seed.json');
  const raw = fs.readFileSync(seedPath, 'utf-8');
  const data: SeedEntry[] = JSON.parse(raw);

  for (const entry of data) {
    await prisma.iPCSection.upsert({
      where: { id: entry.id },
      update: {
        title: entry.title,
        text: entry.text,
        punishment: entry.punishment,
        tags: entry.tags.join(',')
      },
      create: {
        id: entry.id,
        title: entry.title,
        text: entry.text,
        punishment: entry.punishment,
        severity: 0,
        tags: entry.tags.join(',')
      }
    });

    // Create examples; avoid duplicates by checking existing count
    for (const ex of entry.examples) {
      const exists = await prisma.example.findFirst({
        where: { ipcSectionId: entry.id, text: ex }
      });
      if (!exists) {
        await prisma.example.create({
          data: {
            ipcSectionId: entry.id,
            text: ex
          }
        });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
