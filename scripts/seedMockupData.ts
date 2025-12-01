import * as dotenv from "dotenv";

// Load environment variables FIRST, before any other imports
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { connectToDatabase } from "@/lib/mongodb";
import ContentNode from "@/models/ContentNode";

// Helper function to generate random Thai/Arabic text for variety
const generateRandomTitle = (type: string, index: number): string => {
  const titles = {
    category: ["หลักศาสนาอิสลาม", "นิติศาสตร์อิสลาม", "ประวัติศาสตร์อิสลาม"],
    chapter: [
      "บทนำ",
      "หลักการพื้นฐาน",
      "การประยุกต์ใช้",
      "กรณีศึกษา",
      "บทสรุป",
      "การวิเคราะห์",
      "แนวทางปฏิบัติ",
      "ทฤษฎีและหลักการ",
      "การพัฒนา",
      "การประเมินผล",
    ],
    article: [
      "ความรู้เบื้องต้น",
      "การศึกษาเชิงลึก",
      "วิธีการและแนวทาง",
      "ตัวอย่างประกอบ",
      "การปฏิบัติจริง",
      "การวิเคราะห์ข้อมูล",
      "แนวโน้มในอนาคต",
      "ข้อเสนอแนะ",
      "บทเรียนที่ได้รับ",
      "สรุปผลการศึกษา",
    ],
  };

  if (type === "category") {
    return titles.category[index] || `หมวดหมู่ที่ ${index + 1}`;
  }

  const typeTitle = titles[type as keyof typeof titles] || [];
  return typeTitle[index % typeTitle.length] || `${type} ${index + 1}`;
};

const generateRandomSummary = (type: string): string => {
  const summaries = {
    category: [
      "การศึกษาเชิงลึกเกี่ยวกับหลักการและแนวคิดพื้นฐานในศาสนาอิสลาม",
      "ระบบกฎหมายและนิติศาสตร์ในแนวทางอิสลาม พร้มทั้งการประยุกต์ใช้",
      "ประวัติศาสตร์และพัฒนาการของอารยธรรมอิสลามตั้งแต่อดีตจนถึงปัจจุบัน",
    ],
    chapter: [
      "บทเรียนสำคัญที่ครอบคลุมแนวคิดหลักและการประยุกต์ใช้ในชีวิตประจำวัน",
      "การศึกษาเชิงวิเคราะห์เกี่ยวกับหลักการและวิธีการดำเนินงาน",
      "แนวทางปฏิบัติและกรณีศึกษาที่เกี่ยวข้องกับหัวข้อนี้",
      "ทฤษฎีและหลักการพื้นฐานที่จำเป็นสำหรับการเข้าใจเรื่องนี้",
      "การพัฒนาความรู้และทักษะในด้านต่างๆ ของหัวข้อ",
    ],
    article: [
      "บทความที่ให้ความรู้เชิงลึกและการวิเคราะห์ประเด็นสำคัญ",
      "การศึกษาและวิจัยที่นำเสนอข้อมูลและการวิเคราะห์",
      "แนวทางและวิธีการที่มีประสิทธิภาพในการประยุกต์ใช้",
      "ตัวอย่างและกรณีศึกษาที่เป็นประโยชน์ต่อการเรียนรู้",
      "การสรุปและข้อเสนอแนะสำหรับการศึกษาต่อไป",
    ],
  };

  const typeSummaries =
    summaries[type as keyof typeof summaries] || summaries.article;
  return typeSummaries[Math.floor(Math.random() * typeSummaries.length)];
};

const generateSlug = (title: string, index: number): string => {
  return (
    title
      .toLowerCase()
      .replace(/[\s\u0E00-\u0E7F]+/g, "-")
      .replace(/[^\w\-]+/g, "-")
      .replace(/\-\-+/g, "-")
      .replace(/^-+|-+$/g, "") + `-${index}`
  );
};

const generateRandomBody = (title: string): string => {
  return `# ${title}

บทความนี้นำเสนอการศึกษาเชิงลึกเกี่ยวกับ${title} ซึ่งมีความสำคัญต่อการเข้าใจหลักการพื้นฐานในศาสนาอิสลาม

## ความเป็นมา

การศึกษาเรื่องนี้มีรากฐานมาจากแหล่งข้อมูลที่เชื่อถือได้ในคัมภีร์อัลกุรอานและหะดีษศรีฟ ซึ่งเป็นแหล่งความรู้หลักของมุสลิม

## หลักการสำคัญ

### 1. แนวทางในการศึกษา
- การศึกษาจากแหล่งข้อมูลหลัก
- การวิเคราะห์เชิงวิชาการ
- การประยุกต์ใช้ในชีวิตประจำวัน

### 2. การประยุกต์ใช้
การนำหลักการเหล่านี้มาใช้ในชีวิตประจำวันต้องคำนึงถึง:
- บริบททางสังคม
- ความเหมาะสมกับสถานการณ์
- การปรับตัวตามกาลเวลา

## การวิเคราะห์

นักวิชาการได้ศึกษาและวิเคราะห์ประเด็นนี้อย่างละเอียด โดยพบว่ามีแง่มุมต่างๆ ที่ควรพิจารณา:

1. **ความถูกต้องตามหลักศาสนา**: การตรวจสอบความสอดคล้องกับแหล่งข้อมูลหลัก
2. **ความเป็นไปได้ในการปฏิบัติ**: การประเมินความสามารถในการนำไปใช้
3. **ผลกระทบต่อสังคม**: การวิเคราะห์ผลที่อาจเกิดขึ้น

## ข้อเสนอแนะ

จากการศึกษาดังกล่าว สามารถสรุปข้อเสนอแนะได้ดังนี้:

- ควรศึกษาจากแหล่งข้อมูลที่เชื่อถือได้
- ต้องมีการปรึกษาผู้รู้ที่มีความเชี่ยวชาญ
- ควรพิจารณาบริบทและสถานการณ์ที่เหมาะสม

## สรุป

${title} เป็นหัวข้อที่มีความสำคัญและต้องการการศึกษาอย่างรอบคอบ การเข้าใจที่ถูกต้องจะช่วยให้สามารถนำไปประยุกต์ใช้ได้อย่างมีประสิทธิภาพและเหมาะสม

---

*บทความนี้จัดทำขึ้นเพื่อการศึกษาและอ้างอิงทางวิชาการ*`;
};

const authors = ["อับดุลลาห์"];

const getRandomAuthor = (): string => {
  return authors[Math.floor(Math.random() * authors.length)];
};

const getRandomDate = (): string => {
  const start = new Date("2024-01-01");
  const end = new Date("2024-12-31");
  const randomTime =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString().split("T")[0];
};

const getRandomBadge = (): number | "coming-soon" | null => {
  const random = Math.random();
  if (random < 0.7) return null; // 70% no badge (available)
  if (random < 0.9) return Math.floor(Math.random() * 5) + 1; // 20% numbered badge 1-5
  return "coming-soon"; // 10% coming soon
};

async function seedMockupDatabase() {
  try {
    await connectToDatabase();

    // Clear existing data
    await ContentNode.deleteMany({});
    console.log("🗑️  Cleared existing content");

    // Track created items for summary
    const createdItems = {
      categories: 0,
      chapters: 0,
      articles: 0,
    };

    // Create 3 categories
    for (let catIndex = 0; catIndex < 3; catIndex++) {
      const categoryTitle = generateRandomTitle("category", catIndex);
      const categorySlug = generateSlug(categoryTitle, catIndex);

      // Create category
      const category = new ContentNode({
        slug: categorySlug,
        title: categoryTitle,
        summary: generateRandomSummary("category"),
        type: "category",
        author: getRandomAuthor(),
        badge: getRandomBadge(),
        body: "",
        parentId: null,
        path: [],
        order: catIndex,
        published: true,
      });

      const savedCategory = await category.save();
      createdItems.categories++;
      console.log(`📁 Created category: ${categoryTitle}`);

      // Create 5 chapters per category
      for (let chapIndex = 0; chapIndex < 5; chapIndex++) {
        const chapterTitle = generateRandomTitle("chapter", chapIndex);
        const chapterSlug = generateSlug(chapterTitle, chapIndex);

        // Create main chapter
        const chapter = new ContentNode({
          slug: chapterSlug,
          title: chapterTitle,
          summary: generateRandomSummary("chapter"),
          type: "chapter",
          author: getRandomAuthor(),
          badge: getRandomBadge(),
          body: "",
          parentId: savedCategory._id.toString(),
          path: [categorySlug],
          order: chapIndex,
          published: true,
        });

        const savedChapter = await chapter.save();
        createdItems.chapters++;
        console.log(`  📂 Created chapter: ${chapterTitle}`);

        // Create random subchapters (1-3 per chapter)
        const subchapterCount = Math.floor(Math.random() * 3) + 1; // 1-3 subchapters
        let parentChapterId = savedChapter._id.toString();
        let currentPath = [categorySlug, chapterSlug];

        // Create nested subchapters (random levels 1-3)
        const maxLevels = Math.floor(Math.random() * 3) + 1; // 1-3 levels deep

        for (let level = 0; level < maxLevels; level++) {
          const levelSubchapterCount =
            level === 0 ? subchapterCount : Math.floor(Math.random() * 2) + 1;

          for (let subIndex = 0; subIndex < levelSubchapterCount; subIndex++) {
            const subchapterTitle = `${generateRandomTitle("chapter", subIndex + 5)} - ระดับ ${level + 1}`;
            const subchapterSlug = generateSlug(
              subchapterTitle,
              subIndex + level * 10,
            );

            const subchapter = new ContentNode({
              slug: subchapterSlug,
              title: subchapterTitle,
              summary: generateRandomSummary("chapter"),
              type: "chapter",
              author: getRandomAuthor(),
              badge: getRandomBadge(),
              body: "",
              parentId: parentChapterId,
              path: [...currentPath],
              order: subIndex,
              published: true,
            });

            const savedSubchapter = await subchapter.save();
            createdItems.chapters++;
            console.log(
              `    📄 Created subchapter (Level ${level + 1}): ${subchapterTitle}`,
            );

            // Create 5 articles for each (sub)chapter
            for (let articleIndex = 0; articleIndex < 5; articleIndex++) {
              const articleTitle = generateRandomTitle("article", articleIndex);
              const articleSlug = generateSlug(
                articleTitle,
                articleIndex + subIndex * 5 + level * 25,
              );

              const article = new ContentNode({
                slug: articleSlug,
                title: articleTitle,
                summary: generateRandomSummary("article"),
                type: "article",
                author: getRandomAuthor(),
                badge: null, // Articles don't have badges
                body: generateRandomBody(articleTitle),
                parentId: savedSubchapter._id.toString(),
                path: [...currentPath, subchapterSlug],
                order: articleIndex,
                published: Math.random() > 0.1, // 90% published, 10% draft
                createdAt: getRandomDate(),
              });

              await article.save();
              createdItems.articles++;
              console.log(`      📝 Created article: ${articleTitle}`);
            }

            // Update parent for next level
            if (level === 0 && subIndex === 0) {
              parentChapterId = savedSubchapter._id.toString();
              currentPath = [...currentPath, subchapterSlug];
            }
          }
        }

        // Also create 5 articles directly under main chapter
        for (let articleIndex = 0; articleIndex < 5; articleIndex++) {
          const articleTitle = `${generateRandomTitle("article", articleIndex + 5)} - หลัก`;
          const articleSlug = generateSlug(
            articleTitle,
            articleIndex + chapIndex * 100,
          );

          const article = new ContentNode({
            slug: articleSlug,
            title: articleTitle,
            summary: generateRandomSummary("article"),
            type: "article",
            author: getRandomAuthor(),
            badge: null,
            body: generateRandomBody(articleTitle),
            parentId: savedChapter._id.toString(),
            path: [categorySlug, chapterSlug],
            order: articleIndex + 100, // Higher order to appear after subchapters
            published: Math.random() > 0.1,
            createdAt: getRandomDate(),
          });

          await article.save();
          createdItems.articles++;
          console.log(`    📝 Created main chapter article: ${articleTitle}`);
        }
      }
    }

    console.log("\n🎉 Database seeding completed successfully!");

    // Display comprehensive summary
    const totalContent = await ContentNode.countDocuments();
    const categories = await ContentNode.countDocuments({ type: "category" });
    const chapters = await ContentNode.countDocuments({ type: "chapter" });
    const articles = await ContentNode.countDocuments({ type: "article" });
    const published = await ContentNode.countDocuments({ published: true });
    const drafts = await ContentNode.countDocuments({ published: false });

    console.log("\n📊 === DATABASE SUMMARY ===");
    console.log(`📁 Categories: ${categories}`);
    console.log(`📂 Chapters: ${chapters}`);
    console.log(`📝 Articles: ${articles}`);
    console.log(`📊 Total content nodes: ${totalContent}`);
    console.log(`✅ Published content: ${published}`);
    console.log(`📋 Draft content: ${drafts}`);

    // Badge statistics
    const numberedBadges = await ContentNode.countDocuments({
      badge: { $type: "number" },
    });
    const comingSoon = await ContentNode.countDocuments({
      badge: "coming-soon",
    });
    const available = await ContentNode.countDocuments({ badge: null });

    console.log("\n🏷️  === BADGE STATISTICS ===");
    console.log(`🔢 Numbered badges: ${numberedBadges}`);
    console.log(`⏳ Coming soon: ${comingSoon}`);
    console.log(`✅ Available (no badge): ${available}`);

    // Hierarchy statistics
    const rootItems = await ContentNode.countDocuments({ parentId: null });
    const childItems = await ContentNode.countDocuments({
      parentId: { $ne: null },
    });

    console.log("\n🌳 === HIERARCHY STATISTICS ===");
    console.log(`🌿 Root items: ${rootItems}`);
    console.log(`🍃 Child items: ${childItems}`);

    console.log(
      "\n✨ Ready to use! Run `npm run dev` to see your new content.",
    );
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

// Run the seeding
seedMockupDatabase();
