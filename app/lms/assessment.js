const OPTIONS = ["A", "B", "C", "D"];

export function getQuizQuestions(data, courseKey, unitCode) {
  if (courseKey !== "AVSEC") return [];
  const unit = data.avsecCourse.units.find((item) => item.unit_id === unitCode);
  if (!unit) return [];
  const questionsById = new Map(data.avsecQuestionBank.questions.map((question) => [question.id, question]));
  return unit.quiz_refs.map((id) => questionsById.get(id)).filter(Boolean);
}

export function getExamQuestions(data, courseKey, selectedIds) {
  if (courseKey !== "AVSEC" || !data.avsecExam) return [];
  const questionsById = new Map(data.avsecQuestionBank.questions.map((question) => [question.id, question]));
  return (selectedIds || data.avsecExam.preguntas_seleccionadas).map((id) => questionsById.get(id)).filter(Boolean);
}

export function matchesQuestionSet(attempt, questions, contentVersion) {
  return Array.isArray(attempt?.questionIds)
    && attempt.questionIds.length === questions.length
    && attempt.questionIds.every((id, index) => id === questions[index]?.id)
    && (contentVersion === undefined || attempt.contentVersion === contentVersion);
}

export function createDemoQuestions(count, prefix) {
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    return {
      id: `${prefix}-${String(number).padStart(3, "0")}`,
      prompt: `Pregunta de demostración ${number}. Selecciona la opción de prueba.`,
      options: OPTIONS.map((id) => ({
        id,
        text: `Opción ${id} · contenido académico pendiente`
      })),
      correctOptionId: OPTIONS[index % OPTIONS.length],
      explanation: "Solo se valida la mecánica del reproductor. La pregunta, respuesta y retroalimentación oficiales están pendientes de aprobación.",
      topic: `Bloque de práctica demo ${String(Math.floor(index / 5) + 1).padStart(2, "0")}`
    };
  });
}

export function gradeDemoQuestions(questions, answers, passingScore) {
  const topics = new Map();
  let correctCount = 0;

  questions.forEach((question) => {
    const correct = answers[question.id] === question.correctOptionId;
    if (correct) correctCount += 1;
    const topic = topics.get(question.topic) || { name: question.topic, total: 0, correct: 0 };
    topic.total += 1;
    if (correct) topic.correct += 1;
    topics.set(question.topic, topic);
  });

  const percentage = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
  const topicResults = [...topics.values()].map((topic) => ({
    ...topic,
    percentage: Math.round((topic.correct / topic.total) * 100)
  }));

  return {
    correctCount,
    questionCount: questions.length,
    percentage,
    passingScore,
    passed: percentage >= passingScore,
    strongTopics: topicResults.filter((topic) => topic.percentage >= passingScore),
    weakTopics: topicResults.filter((topic) => topic.percentage < passingScore)
  };
}
