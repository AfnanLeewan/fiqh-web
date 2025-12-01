import { ContentNode } from "@/types/content";

export const mockData: ContentNode[] = [
  {
    id: "1",
    slug: "tafseer",
    title: "The overall tafseer of Quran",
    summary:
      "Comprehensive commentary and interpretation of the Holy Quran covering classical and contemporary approaches.",
    type: "category",
    children: [
      {
        id: "1-1",
        slug: "foundation",
        title: "หลักมูลเบื้องต้น",
        summary: "Foundation principles of Quranic interpretation",
        type: "chapter",
        badge: 1,
        children: [
          {
            id: "1-1-1",
            slug: "introduction",
            title: "บทนำ",
            summary: "Introduction to Tafseer principles",
            type: "chapter",
            badge: 1,
            children: [
              {
                id: "1-1-1-1",
                slug: "what-is-tafseer",
                title: "หัวข้อย่อย",
                summary: "Understanding the essence of Quranic commentary",
                type: "article",
                author: "Dr. Ahmad Hassan",
                createdAt: "2024-01-15",
                badge: 1,
                body: `The science of Tafseer (Quranic exegesis) is one of the most noble and essential disciplines in Islamic scholarship. It represents the systematic interpretation and explanation of the Holy Quran's verses, their meanings, contexts, and applications.

## Historical Development

Tafseer has its roots in the time of Prophet Muhammad (peace be upon him), who was the first and most authentic interpreter of the Quranic revelation. The Companions (Sahabah) learned directly from him, and this knowledge was then passed down through generations of scholars.

## Types of Tafseer

### Tafseer bil-Ma'thur (Traditional Commentary)
This approach relies on:
- Quranic verses explaining other verses
- Prophetic traditions (Hadith)
- Statements of the Companions
- Views of the early Muslim scholars (Tabi'in)

### Tafseer bil-Ra'y (Rational Commentary)  
This method employs:
- Arabic linguistic analysis
- Logical reasoning
- Historical context
- Literary appreciation

## Methodology and Principles

The science of Tafseer follows strict methodological principles to ensure accuracy and authenticity. Scholars must possess deep knowledge of Arabic language, Islamic jurisprudence, theology, and the historical context of revelation.

Understanding these foundational concepts is crucial for anyone seeking to study the Quran with proper guidance and scholarly rigor.`,
              },
              {
                id: "1-1-1-2",
                slug: "history-of-tafseer",
                title: "ประวัติศาสตร์การตีความ",
                summary:
                  "Historical development of Quranic commentary through different eras",
                type: "article",
                author: "Prof. Zahra Al-Ansari",
                createdAt: "2024-01-18",
                badge: 2,
                body: `The history of Tafseer spans over fourteen centuries, evolving through distinct periods each marked by unique characteristics and contributions.

## The Prophetic Era (610-632 CE)

During this foundational period, the Prophet Muhammad (peace be upon him) provided the primary interpretation of Quranic verses. His explanations, recorded in authentic Hadith collections, form the cornerstone of all subsequent commentary.

## The Companions' Era (632-700 CE)

The Sahabah, having learned directly from the Prophet, became the first generation of Quranic interpreters. Notable figures include:
- Ibn Abbas (known as "Turjuman al-Quran")
- Ibn Mas'ud
- Ubayy ibn Ka'b
- Ali ibn Abi Talib

## The Tabi'in Period (700-800 CE)

Students of the Companions carried forward the tradition, with scholars like:
- Mujahid ibn Jabr
- Sa'id ibn Jubayr  
- Al-Hasan al-Basri
- Qatadah ibn Di'amah

## Classical Period (800-1200 CE)

This era saw the compilation of comprehensive Tafseer works:
- Tafseer al-Tabari by Ibn Jarir al-Tabari
- Tafseer Ibn Kathir by Ibn Kathir
- Al-Kashf wa'l-Bayan by Al-Tha'labi

## Modern Era (1800-Present)

Contemporary scholars have adapted classical methodologies to address modern contexts while maintaining traditional authenticity.`,
              },
            ],
          },
          {
            id: "1-1-2",
            slug: "principles",
            title: "หลักการพื้นฐาน",
            summary: "Core principles and rules for Quranic interpretation",
            type: "chapter",
            badge: 2,
            children: [
              {
                id: "1-1-2-1",
                slug: "linguistic-principles",
                title: "หลักการทางภาษาศาสตร์",
                type: "article",
                author: "Dr. Muhammad Al-Ghazali",
                createdAt: "2024-01-25",
                badge: 1,
                body: "Linguistic principles form the foundation of proper Quranic interpretation. Understanding Arabic grammar, rhetoric, and semantics is essential...",
              },
              {
                id: "1-1-2-2",
                slug: "contextual-analysis",
                title: "การวิเคราะห์บริบท",
                type: "article",
                author: "Dr. Aisha Abdel Rahman",
                createdAt: "2024-02-01",
                badge: 2,
                body: "Contextual analysis involves understanding the circumstances of revelation (Asbab al-Nuzul) and the historical context...",
              },
            ],
          },
        ],
      },
      {
        id: "1-2",
        slug: "methodology",
        title: "منهجية التفسير",
        summary: "Methodology of Quranic interpretation",
        type: "chapter",
        badge: 2,
        children: [
          {
            id: "1-2-1",
            slug: "classical-methods",
            title: "Classical Methods",
            summary: "Traditional approaches to Quranic commentary",
            type: "article",
            author: "Dr. Sarah Abdullah",
            createdAt: "2024-01-20",
            badge: 1,
            body: `Classical methods of Quranic interpretation have been developed over centuries by renowned scholars who established systematic approaches to understanding the divine text.

## The Four Primary Sources

### 1. Quran Explains Quran (Al-Quran Yufassir Ba'dahu Ba'dan)
The most authentic method where one verse clarifies another. This principle recognizes that the Quran is internally consistent and self-explanatory.

### 2. Prophetic Traditions (As-Sunnah)
The Prophet's sayings, actions, and approvals provide crucial context and explanation for Quranic verses.

### 3. Statements of Companions (Aqwal as-Sahabah)
Those who witnessed the revelation and learned directly from the Prophet offer invaluable insights.

### 4. Arabic Language and Literature
Understanding classical Arabic, its grammar, rhetoric, and poetic traditions is essential for proper interpretation.

## Methodological Framework

Classical scholars developed rigorous methodologies including:
- **Isnad** (chain of transmission) verification
- **Matn** (content) analysis  
- Cross-referencing with established sources
- Contextual consideration of revelation circumstances

These methods ensure accuracy and prevent misinterpretation while maintaining the sacred nature of the text.`,
          },
          {
            id: "1-2-2",
            slug: "modern-approaches",
            title: "Modern Approaches",
            summary: "Contemporary methods in Quranic studies",
            type: "article",
            author: "Dr. Hassan Al-Turabi",
            createdAt: "2024-02-10",
            badge: 2,
            body: "Modern approaches to Tafseer incorporate contemporary scholarly methods while maintaining traditional authenticity...",
          },
          {
            id: "1-2-3",
            slug: "comparative-study",
            title: "Comparative Study Methods",
            type: "article",
            author: "Prof. Aminah Wadud",
            createdAt: "2024-02-15",
            badge: 3,
            body: "Comparative methodology in Tafseer involves analyzing different interpretations and scholarly opinions...",
          },
        ],
      },
      {
        id: "1-3",
        slug: "themes",
        title: "Thematic Studies",
        summary: "Thematic analysis of Quranic topics",
        type: "chapter",
        badge: 3,
        children: [
          {
            id: "1-3-1",
            slug: "social-justice",
            title: "Social Justice in the Quran",
            type: "article",
            author: "Dr. Abdolkarim Soroush",
            createdAt: "2024-02-20",
            badge: 1,
            body: "The Quran presents a comprehensive framework for social justice that encompasses economic, political, and social dimensions...",
          },
          {
            id: "1-3-2",
            slug: "environmental-ethics",
            title: "Environmental Ethics",
            type: "article",
            author: "Dr. Seyyed Hossein Nasr",
            createdAt: "2024-02-25",
            badge: 2,
            body: "Quranic verses emphasize humanity's role as stewards of the Earth and the importance of environmental conservation...",
          },
        ],
      },
      {
        id: "1-4",
        slug: "advanced-topics",
        title: "Advanced Topics",
        summary: "Specialized areas in Quranic studies",
        type: "chapter",
        badge: "coming-soon",
      },
    ],
  },
  {
    id: "2",
    slug: "hadith",
    title: "Hadith Studies",
    summary:
      "Comprehensive study of prophetic traditions and their interpretations in Islamic scholarship.",
    type: "category",
    children: [
      {
        id: "2-1",
        slug: "authenticity",
        title: "Science of Hadith Authentication",
        summary: "Methods and principles for verifying hadith authenticity",
        type: "chapter",
        badge: 1,
        children: [
          {
            id: "2-1-1",
            slug: "chain-analysis",
            title: "Chain of Narration Analysis",
            summary: "Detailed study of isnad verification methods",
            type: "article",
            author: "Prof. Muhammad Ali",
            createdAt: "2024-02-01",
            badge: 1,
            body: `The science of analyzing chains of narration (Isnad) is fundamental to hadith studies and represents one of the most sophisticated methodologies in Islamic scholarship for ensuring authenticity.

## Historical Development

The systematic study of Isnad developed during the first few centuries of Islam as scholars recognized the need to preserve authentic prophetic traditions while filtering out fabricated reports.

## Key Components of Chain Analysis

### 1. Narrator Reliability (Jarh wa Ta'dil)
Scholars developed detailed biographical studies of thousands of narrators, evaluating:
- **Trustworthiness (Thiqa)**: Moral integrity and honesty
- **Memory (Dabt)**: Accuracy in preservation and transmission
- **Meeting Criteria**: Verification that narrators actually met their sources

### 2. Chain Continuity
Each link in the transmission chain must be verified:
- Direct teacher-student relationships
- Chronological feasibility of meetings
- Geographical possibility of encounters

### 3. Narrator Categories
Classical scholars classified narrators into grades:
- **Thiqa (Trustworthy)**: Highest reliability
- **Saduq (Truthful)**: Generally reliable with minor weaknesses  
- **Da'if (Weak)**: Various degrees of unreliability
- **Matruk (Abandoned)**: Severely unreliable or fabricators

## Methodological Principles

The authentication process involves multiple verification stages and cross-referencing with established biographical works, ensuring the highest standards of historical accuracy.`,
          },
          {
            id: "2-1-2",
            slug: "text-criticism",
            title: "Text Criticism (Naqd al-Matn)",
            summary: "Analyzing hadith content for authenticity markers",
            type: "article",
            author: "Dr. Hatim Al-Awni",
            createdAt: "2024-02-05",
            badge: 2,
            body: "Text criticism examines the actual content of hadith reports for internal consistency and compatibility with established Islamic principles...",
          },
          {
            id: "2-1-3",
            slug: "grading-systems",
            title: "Hadith Grading Systems",
            type: "article",
            author: "Sheikh Abdullah Al-Judai",
            createdAt: "2024-02-10",
            badge: 3,
            body: "Understanding the various classification systems used by different schools of hadith criticism...",
          },
        ],
      },
      {
        id: "2-2",
        slug: "collections",
        title: "Major Hadith Collections",
        summary:
          "Study of the six canonical collections and other important works",
        type: "chapter",
        badge: 2,
        children: [
          {
            id: "2-2-1",
            slug: "sahih-bukhari",
            title: "Sahih al-Bukhari",
            type: "article",
            author: "Dr. Muhammad Mustafa Azami",
            createdAt: "2024-02-12",
            badge: 1,
            body: "Sahih al-Bukhari is widely regarded as the most authentic collection of hadith after the Quran...",
          },
          {
            id: "2-2-2",
            slug: "sahih-muslim",
            title: "Sahih Muslim",
            type: "article",
            author: "Prof. Abdul Ghafur Siddiqui",
            createdAt: "2024-02-15",
            badge: 2,
            body: "Sahih Muslim is the second most authentic hadith collection, known for its systematic organization...",
          },
          {
            id: "2-2-3",
            slug: "sunan-works",
            title: "The Four Sunan Collections",
            type: "article",
            author: "Dr. Basheer Ahmad Masri",
            createdAt: "2024-02-18",
            badge: 3,
            body: "Abu Dawud, Tirmidhi, Nasa'i, and Ibn Majah compiled comprehensive collections focusing on legal traditions...",
          },
        ],
      },
      {
        id: "2-3",
        slug: "application",
        title: "Contemporary Applications",
        summary: "Modern usage and interpretation of hadith",
        type: "chapter",
        badge: 3,
        children: [
          {
            id: "2-3-1",
            slug: "legal-methodology",
            title: "Hadith in Legal Methodology",
            type: "article",
            author: "Justice Taqi Usmani",
            createdAt: "2024-02-22",
            badge: 1,
            body: "The role of hadith in Islamic jurisprudence and legal reasoning in contemporary contexts...",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    slug: "fiqh",
    title: "Islamic Jurisprudence (Fiqh)",
    summary:
      "Comprehensive study of Islamic law, its principles, methodology, and practical applications.",
    type: "category",
    children: [
      {
        id: "3-1",
        slug: "principles",
        title: "Principles of Jurisprudence (Usul al-Fiqh)",
        summary: "Foundational methodology of Islamic legal reasoning",
        type: "chapter",
        badge: 1,
        children: [
          {
            id: "3-1-1",
            slug: "sources-of-law",
            title: "Primary Sources of Islamic Law",
            type: "article",
            author: "Dr. Mohammad Hashim Kamali",
            createdAt: "2024-03-01",
            badge: 1,
            body: "Islamic law derives from four primary sources: Quran, Sunnah, Ijma (consensus), and Qiyas (analogical reasoning)...",
          },
          {
            id: "3-1-2",
            slug: "interpretive-methods",
            title: "Methods of Legal Interpretation",
            type: "article",
            author: "Prof. Abdolkarim Soroush",
            createdAt: "2024-03-05",
            badge: 2,
            body: "Various methodologies for interpreting Islamic legal texts including literal, contextual, and purposive approaches...",
          },
        ],
      },
      {
        id: "3-2",
        slug: "schools",
        title: "Schools of Jurisprudence (Madhahib)",
        summary: "Study of different legal schools and their methodologies",
        type: "chapter",
        badge: 2,
        children: [
          {
            id: "3-2-1",
            slug: "hanafi-school",
            title: "The Hanafi School",
            type: "article",
            author: "Dr. Wael Hallaq",
            createdAt: "2024-03-08",
            badge: 1,
            body: "The Hanafi school, founded by Imam Abu Hanifa, emphasizes rational reasoning and local customs...",
          },
          {
            id: "3-2-2",
            slug: "shafii-school",
            title: "The Shafi'i School",
            type: "article",
            author: "Prof. Ahmed Al-Raysuni",
            createdAt: "2024-03-12",
            badge: 2,
            body: "Imam al-Shafi'i established systematic legal methodology and emphasized hadith authentication...",
          },
          {
            id: "3-2-3",
            slug: "other-schools",
            title: "Maliki and Hanbali Schools",
            type: "article",
            author: "Dr. Abdullah Al-Turki",
            createdAt: "2024-03-15",
            badge: 3,
            body: "Overview of the Maliki and Hanbali schools of jurisprudence and their distinctive features...",
          },
        ],
      },
      {
        id: "3-3",
        slug: "contemporary-issues",
        title: "Contemporary Jurisprudential Issues",
        summary: "Modern challenges in Islamic law",
        type: "chapter",
        badge: 3,
        children: [
          {
            id: "3-3-1",
            slug: "bioethics",
            title: "Islamic Bioethics",
            type: "article",
            author: "Dr. Abdulaziz Sachedina",
            createdAt: "2024-03-18",
            badge: 1,
            body: "Islamic perspectives on modern bioethical issues including genetics, organ transplantation, and end-of-life care...",
          },
          {
            id: "3-3-2",
            slug: "financial-law",
            title: "Islamic Financial Law",
            type: "article",
            author: "Dr. Muhammad Taqi Usmani",
            createdAt: "2024-03-20",
            badge: 2,
            body: "Principles and applications of Islamic finance in contemporary banking and investment...",
          },
        ],
      },
    ],
  },
  {
    id: "4",
    slug: "aqeedah",
    title: "Islamic Creed (Aqeedah)",
    summary:
      "Fundamental beliefs and theological principles in Islam covering monotheism, prophethood, and eschatology.",
    type: "category",
    children: [
      {
        id: "4-1",
        slug: "fundamentals",
        title: "Fundamental Beliefs",
        summary: "Core beliefs in Islamic theology",
        type: "chapter",
        badge: 1,
        children: [
          {
            id: "4-1-1",
            slug: "tawheed",
            title: "Monotheism in Islam (Tawheed)",
            summary: "The unity and uniqueness of Allah",
            type: "article",
            author: "Dr. Fatima Al-Zahra",
            createdAt: "2024-02-15",
            badge: 1,
            body: `The concept of Tawheed (monotheism) is the foundation of Islamic belief and the central organizing principle of Muslim faith and practice.

## Three Categories of Tawheed

### 1. Tawheed ar-Rububiyyah (Unity of Lordship)
Recognition that Allah alone is the Creator, Sustainer, and Controller of the universe. This includes acknowledgment of His absolute sovereignty over all creation.

### 2. Tawheed al-Uluhiyyah (Unity of Worship)  
The exclusive direction of all acts of worship to Allah alone, without any partners or intermediaries. This encompasses prayer, supplication, sacrifice, and other devotional acts.

### 3. Tawheed al-Asma wa's-Sifat (Unity of Names and Attributes)
Affirmation of Allah's beautiful names and perfect attributes as revealed in the Quran and authentic Sunnah, without comparison to creation or anthropomorphism.

## Theological Implications

Tawheed fundamentally shapes the Muslim worldview, establishing:
- **Moral Framework**: Divine guidance as the ultimate source of ethics
- **Social Order**: Equality before Allah regardless of social status
- **Spiritual Development**: Direct relationship between individual and Creator
- **Purpose of Existence**: Worship and service to Allah alone

## Historical Development

The understanding of Tawheed has been refined through centuries of theological discourse, with scholars clarifying its implications against various philosophical challenges while maintaining scriptural authenticity.`,
          },
          {
            id: "4-1-2",
            slug: "prophethood",
            title: "Prophethood (Nubuwwah)",
            type: "article",
            author: "Prof. Seyyed Hossein Nasr",
            createdAt: "2024-02-18",
            badge: 2,
            body: "The institution of prophethood represents Allah's mercy in providing guidance to humanity through chosen messengers...",
          },
          {
            id: "4-1-3",
            slug: "afterlife",
            title: "Belief in the Afterlife",
            type: "article",
            author: "Dr. Amina Wadud",
            createdAt: "2024-02-22",
            badge: 3,
            body: "Islamic eschatology encompasses detailed beliefs about death, resurrection, judgment, and eternal destinations...",
          },
        ],
      },
      {
        id: "4-2",
        slug: "theological-schools",
        title: "Theological Schools (Kalam)",
        summary: "Different approaches to Islamic theology",
        type: "chapter",
        badge: 2,
        children: [
          {
            id: "4-2-1",
            slug: "ashari-school",
            title: "Ash'ari Theology",
            type: "article",
            author: "Dr. Richard Frank",
            createdAt: "2024-02-25",
            badge: 1,
            body: "The Ash'ari school developed sophisticated theological arguments defending orthodox Islamic beliefs...",
          },
          {
            id: "4-2-2",
            slug: "maturidi-school",
            title: "Maturidi Theology",
            type: "article",
            author: "Prof. Ulrich Rudolph",
            createdAt: "2024-03-01",
            badge: 2,
            body: "Abu Mansur al-Maturidi established an influential theological approach emphasizing reason and revelation...",
          },
        ],
      },
      {
        id: "4-3",
        slug: "contemporary-theology",
        title: "Contemporary Theological Issues",
        summary: "Modern challenges in Islamic theology",
        type: "chapter",
        badge: "coming-soon",
      },
    ],
  },
  {
    id: "5",
    slug: "seerah",
    title: "Prophetic Biography (Seerah)",
    summary:
      "Comprehensive study of the life, character, and teachings of Prophet Muhammad (peace be upon him).",
    type: "category",
    children: [
      {
        id: "5-1",
        slug: "early-life",
        title: "Early Life and Call to Prophethood",
        summary: "Pre-Islamic period and the beginning of revelation",
        type: "chapter",
        badge: 1,
        children: [
          {
            id: "5-1-1",
            slug: "birth-childhood",
            title: "Birth and Childhood",
            type: "article",
            author: "Dr. Martin Lings",
            createdAt: "2024-03-25",
            badge: 1,
            body: "The birth of Prophet Muhammad in 570 CE in Mecca marked the beginning of a life that would transform humanity...",
          },
          {
            id: "5-1-2",
            slug: "first-revelation",
            title: "The First Revelation",
            type: "article",
            author: "Prof. Maxime Rodinson",
            createdAt: "2024-03-28",
            badge: 2,
            body: "The momentous event in the Cave of Hira when Angel Gabriel first appeared to the Prophet with the divine message...",
          },
        ],
      },
      {
        id: "5-2",
        slug: "meccan-period",
        title: "The Meccan Period",
        summary: "Thirteen years of preaching and persecution in Mecca",
        type: "chapter",
        badge: 2,
        children: [
          {
            id: "5-2-1",
            slug: "early-preaching",
            title: "Early Preaching and Opposition",
            type: "article",
            author: "Dr. Karen Armstrong",
            createdAt: "2024-04-01",
            badge: 1,
            body: "The initial phase of Islamic preaching faced significant opposition from the Meccan aristocracy...",
          },
        ],
      },
      {
        id: "5-3",
        slug: "medinan-period",
        title: "The Medinan Period",
        summary: "Ten years of community building and governance",
        type: "chapter",
        badge: "coming-soon",
      },
    ],
  },
  {
    id: "6",
    slug: "islamic-history",
    title: "Islamic History",
    summary:
      "Comprehensive study of Islamic civilization from the prophetic era to modern times.",
    type: "category",
    children: [
      {
        id: "6-1",
        slug: "early-caliphate",
        title: "The Rightly-Guided Caliphs",
        summary: "The first four caliphs and the foundational period",
        type: "chapter",
        badge: 1,
        children: [
          {
            id: "6-1-1",
            slug: "abu-bakr",
            title: "Abu Bakr as-Siddiq (RA)",
            type: "article",
            author: "Dr. Akram Diya al-Umari",
            createdAt: "2024-04-05",
            badge: 1,
            body: "The first caliph faced the challenge of preserving Islamic unity during the Ridda wars...",
          },
        ],
      },
      {
        id: "6-2",
        slug: "umayyad-dynasty",
        title: "The Umayyad Dynasty",
        summary: "First major Islamic dynasty and territorial expansion",
        type: "chapter",
        badge: "coming-soon",
      },
    ],
  },
  {
    id: "7",
    slug: "islamic-philosophy",
    title: "Islamic Philosophy",
    summary:
      "Philosophical traditions in Islamic thought including metaphysics, ethics, and logic.",
    type: "category",
    badge: "coming-soon",
  },
];
