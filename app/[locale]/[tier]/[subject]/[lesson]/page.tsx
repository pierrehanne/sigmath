import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Clock3, Gauge } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { mdxComponents } from "@/components/mdx-components";
import { getLesson, getLessonParams, getLessons } from "@/lib/content";
import { getSubjectName, getTier, isLocale, isTier, siteUrl } from "@/lib/site";
import { games } from "@/lib/games";
import { labNotes, lessonLabs, readingWithoutLabs } from "@/lib/labs";
import { LessonLab } from "@/components/lesson-lab";
import "@/app/labs.css";

type Props = { params: Promise<{ locale: string; tier: string; subject: string; lesson: string }> };

export function generateStaticParams() {
  return getLessonParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, tier, subject, lesson: slug } = await params;
  if (!isLocale(locale) || !isTier(tier)) return {};
  const lesson = await getLesson(locale, tier, subject, slug);
  if (!lesson) return {};
  return {
    title: lesson.title,
    description: lesson.description,
    alternates: { canonical: `/${locale}/${tier}/${subject}/${slug}` },
  };
}

export default async function LessonPage({ params }: Props) {
  const { locale, tier, subject, lesson: slug } = await params;
  if (!isLocale(locale) || !isTier(tier)) notFound();
  const [lesson, lessons] = await Promise.all([getLesson(locale, tier, subject, slug), getLessons(locale, tier)]);
  if (!lesson) notFound();
  const tierInfo = getTier(tier);
  const currentIndex = lessons.findIndex((item) => item.slug === slug);
  const nextLesson = lessons[currentIndex + 1];
  const previousLesson = lessons[currentIndex - 1];
  const hasGame = games.some((game) => game.lesson === `${tier}/${subject}/${slug}`);
  const labId = lessonLabs[`${tier}/${slug}`];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    description: lesson.description,
    url: `${siteUrl}/${locale}/${tier}/${subject}/${slug}`,
    inLanguage: locale,
    learningResourceType: "Lesson",
    educationalLevel: tierInfo.title,
    about: getSubjectName(lesson.subject),
    timeRequired: `PT${lesson.estimatedMinutes}M`,
    isPartOf: { "@type": "Course", name: tierInfo.title },
  };

  return (
    <div className="lesson-shell" style={{ "--lesson-color": lesson.color ?? tierInfo.color } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <aside className="lesson-sidebar">
        <Link className="back-to-tier" href={`/${locale}/${tier}`}><ArrowLeft />{tierInfo.title}</Link>
        <div className="sidebar-progress"><span>Position dans le parcours</span><strong>{currentIndex + 1} / {lessons.length}</strong><i><b style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }} /></i></div>
        <nav aria-label="Leçons du niveau">
          {lessons.map((item, index) => (
            <Link className={item.slug === slug ? "active" : ""} href={`/${locale}/${tier}/${item.subject}/${item.slug}`} key={item.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>{item.title}
            </Link>
          ))}
        </nav>
      </aside>

      <article className="lesson-article">
        <div className="lesson-breadcrumb"><Link href={`/${locale}/${tier}`}>{tierInfo.title}</Link><span>/</span><span>{getSubjectName(lesson.subject)}</span></div>
        <header className="lesson-header">
          <div className="lesson-kicker"><span>Leçon {String(currentIndex + 1).padStart(2, "0")}</span><span className="status"><i />À ton rythme</span></div>
          <h1>{lesson.title}</h1>
          <p>{lesson.description}</p>
          <div className="lesson-facts">
            <span><Clock3 />{lesson.estimatedMinutes} min</span>
            <span><Gauge />Niveau {lesson.difficulty}/3</span>
          </div>
        </header>
        <div className="lesson-rule" />
        {labId ? <div className="lesson-experiment" data-lab={labId}><LessonLab key={`${tier}/${slug}`} id={labId} /><aside className="lab-takeaway"><strong>À retenir</strong><p>{labNotes[labId]}</p></aside></div> : null}
        <details className="lesson-reading" open>
          <summary>Pour aller plus loin · explications et exercices</summary>
        <div className="mdx-content">
          <MDXRemote
            source={labId ? readingWithoutLabs(lesson.source) : lesson.source}
            components={mdxComponents()}
            options={{ mdxOptions: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] } }}
          />
        </div>
        </details>

        {hasGame ? <aside className="lesson-play-link"><strong>Et si tu essayais par toi-même ?</strong><p>Retrouve cette idée dans les jeux : manipule, demande un indice et vérifie ce que tu comprends.</p><Link className="button button--primary" href={`/${locale}/games`}>Passer aux jeux<ArrowRight size={17} /></Link></aside> : null}

        <footer className="lesson-navigation">
          {previousLesson ? <Link href={`/${locale}/${tier}/${previousLesson.subject}/${previousLesson.slug}`}><ArrowLeft /><span><small>Précédent</small>{previousLesson.title}</span></Link> : <span />}
          {nextLesson ? <Link className="next" href={`/${locale}/${tier}/${nextLesson.subject}/${nextLesson.slug}`}><span><small>Suivant</small>{nextLesson.title}</span><ArrowRight /></Link> : <Link className="next" href={`/${locale}/${tier}`}><span><small>Terminé</small>Retour au parcours</span><BookOpen /></Link>}
        </footer>
      </article>
    </div>
  );
}
