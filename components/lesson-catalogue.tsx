"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Search, X } from "lucide-react";
import type { LessonMeta } from "@/lib/content";
import { getSubjectName, type Locale } from "@/lib/site";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function LessonCatalogue({ lessons, locale }: { lessons: LessonMeta[]; locale: Locale }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const subjects = [...new Set(lessons.map((lesson) => lesson.subject))];
  const visible = lessons.filter((lesson) => (!subject || lesson.subject === subject) && normalize(`${lesson.title} ${lesson.description} ${getSubjectName(lesson.subject)}`).includes(normalize(query.trim())));
  return (
    <div>
      <div className="catalogue-tools">
        <label className="lesson-search"><span>Quelle notion veux-tu comprendre ?</span><div><Search size={19} aria-hidden="true" /><input type="search" placeholder="Fractions, triangles, nombres…" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button type="button" aria-label="Effacer la recherche" onClick={() => setQuery("")}><X size={17} /></button>}</div></label>
        <div className="subject-filters" role="group" aria-label="Filtrer les cours par matière">
          <button type="button" aria-pressed={!subject} onClick={() => setSubject("")}>Toutes les matières</button>
          {subjects.map((item) => <button type="button" key={item} aria-pressed={subject === item} onClick={() => setSubject(item)}>{getSubjectName(item)}</button>)}
        </div>
      </div>
      <p className="catalogue-count" role="status">{visible.length} {visible.length === 1 ? "leçon disponible" : "leçons disponibles"}</p>
      <div className="lesson-list">
        {visible.map((lesson) => <Link className="lesson-card" href={`/${locale}/${lesson.tier}/${lesson.subject}/${lesson.slug}`} key={lesson.slug}>
          <span className="lesson-index">{String(lessons.indexOf(lesson) + 1).padStart(2, "0")}</span>
          <span className="lesson-dot" style={{ background: lesson.color }} />
          <div><span className="lesson-subject">{getSubjectName(lesson.subject)}</span><h3>{lesson.title}</h3><p>{lesson.description}</p></div>
          <span className="lesson-time"><Clock3 />{lesson.estimatedMinutes} min</span><ArrowRight className="lesson-arrow" />
        </Link>)}
      </div>
      {!visible.length && <div className="catalogue-empty"><Search size={28} aria-hidden="true" /><h3>Aucune leçon pour cette recherche</h3><p>Essaie un mot plus court, comme « nombre », ou affiche toutes les matières.</p><button type="button" className="button button--primary" onClick={() => { setQuery(""); setSubject(""); }}>Voir toutes les leçons</button></div>}
    </div>
  );
}
