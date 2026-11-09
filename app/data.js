async function loadJson(fileName) {
  const dataRoot = document.body.dataset.dataRoot || "./assets/data/";
  const base = dataRoot.endsWith("/") ? dataRoot : `${dataRoot}/`;
  const response = await fetch(new URL(`${base}${fileName}`, document.baseURI));
  if (!response.ok) throw new Error(`No se pudo cargar ${fileName} (${response.status}).`);
  return response.json();
}

function normalizeQuestion(question) {
  return {
    ...question,
    correctOptionId: question.correct_option_id,
    reviewRecommendation: question.review_recommendation,
    referenceRefs: question.reference_refs
  };
}

function validateAvsecContent(course, bank, evaluations) {
  const questions = bank.questions;
  const questionIds = new Set(questions.map((question) => question.id));
  const referenceIds = new Set(course.references.map((reference) => reference.reference_id));
  const exam = evaluations.find((evaluation) => evaluation.curso_codigo === course.course_id);
  if (course.units.length !== 5 || questions.length !== 50 || questionIds.size !== questions.length) {
    throw new Error("El paquete AVSEC requiere cinco unidades y 50 preguntas únicas.");
  }
  if (!exam || exam.preguntas !== 35 || exam.porcentaje_aprobacion !== 80
      || exam.preguntas_seleccionadas.length !== 35
      || new Set(exam.preguntas_seleccionadas).size !== 35) {
    throw new Error("La evaluación AVSEC debe seleccionar 35 preguntas únicas y usar el umbral demo de 80%.");
  }
  for (const question of questions) {
    const optionIds = question.options.map((option) => option.id).sort().join(",");
    if (optionIds !== "A,B,C,D" || !question.options.some((option) => option.id === question.correct_option_id)) {
      throw new Error(`La pregunta ${question.id} debe tener opciones A–D y una respuesta válida.`);
    }
    if (question.reference_refs.some((id) => !referenceIds.has(id))) {
      throw new Error(`La pregunta ${question.id} contiene una referencia no definida.`);
    }
  }
  for (const unit of course.units) {
    if (unit.quiz_refs.length !== 5 || unit.quiz_refs.some((id) => !questionIds.has(id))
        || !unit.lesson?.lesson_id || !unit.activity?.activity_id) {
      throw new Error(`La unidad ${unit.unit_id} tiene referencias LMS incompletas.`);
    }
  }
  if (exam.preguntas_seleccionadas.some((id) => !questionIds.has(id))
      || course.references.some((reference) => !reference.url)) {
    throw new Error("El paquete AVSEC tiene referencias de examen o bibliografía sin resolver.");
  }
}

export async function loadDemoData() {
  const [
    base,
    userFile,
    companyFile,
    clientFile,
    consignasFile,
    incidentsFile,
    inventoryFile,
    coursesFile,
    unitsFile,
    lessonsFile,
    evaluationsFile,
    configurationFile,
    lmsDemo,
    avsecCourse,
    avsecQuestionBank
  ] = await Promise.all([
    loadJson("demo-data.json"),
    loadJson("usuario.json"),
    loadJson("empresa.json"),
    loadJson("cliente.json"),
    loadJson("consignas.json"),
    loadJson("incidentes.json"),
    loadJson("inventario.json"),
    loadJson("cursos.json"),
    loadJson("unidades.json"),
    loadJson("lecciones.json"),
    loadJson("evaluaciones.json"),
    loadJson("configuracion.json"),
    loadJson("lms-demo.json"),
    loadJson("avsec-course.json"),
    loadJson("avsec-question-bank.json")
  ]);

  validateAvsecContent(avsecCourse, avsecQuestionBank, evaluationsFile.evaluaciones);

  const courseImages = {
    AVSEC: "course-avsec.svg",
    MERCANCIAS_PELIGROSAS: "course-dangerous-goods.svg",
    SMS: "course-sms.svg"
  };
  const imageRoot = document.body.dataset.dataRoot === "./" ? "./" : "./assets/images/";
  const courses = coursesFile.cursos.map((course) => {
    const courseUnits = unitsFile.unidades.filter((item) => item.curso_codigo === course.codigo);
    const unit = courseUnits[0];
    const lesson = lessonsFile.lecciones.find((item) => item.unidad_codigo === unit?.codigo);
    return {
      key: course.key,
      code: course.codigo,
      title: course.titulo,
      tag: course.etiqueta,
      description: course.descripcion,
      status: course.estado_demo,
      progress: course.porcentaje_inicial_demo,
      image: `${imageRoot}${courseImages[course.key]}`,
      unitCount: courseUnits.length,
      durationMinutes: courseUnits.reduce((total, item) => total + (Number(item.duracion_minutos) || 0), 0) || null,
      evaluationQuestionCount: course.key === "AVSEC"
        ? evaluationsFile.evaluaciones.find((evaluation) => evaluation.curso_codigo === course.codigo)?.preguntas || 0
        : 0,
      contentVersion: course.key === "AVSEC" ? avsecCourse.content_version : null,
      units: courseUnits.map((item) => ({
        ...item,
        lessons: lessonsFile.lecciones.filter((lessonItem) => lessonItem.unidad_codigo === item.codigo)
      })),
      unitCode: unit?.codigo,
      unitTitle: unit?.titulo,
      lessonCode: lesson?.codigo,
      lessonTitle: lesson?.titulo
    };
  });

  return {
    user: {
      name: `${userFile.usuario.nombres} ${userFile.usuario.apellidos}`,
      employeeId: userFile.contexto_demo.employee_id,
      group: userFile.contexto_demo.grupo,
      codigo: userFile.usuario.codigo
    },
    company: companyFile.metadatos_visualizacion.nombre,
    client: {
      name: clientFile.cliente.nombre,
      site: clientFile.sitio_demo,
      code: clientFile.cliente.codigo
    },
    shift: base.shift,
    consignas: consignasFile.consignas.map((item) => ({
      title: item.titulo,
      description: item.descripcion
    })),
    timeline: base.timeline,
    incidents: incidentsFile.incidentes,
    inventory: inventoryFile,
    units: unitsFile.unidades,
    lessons: lessonsFile.lecciones,
    lmsDemo,
    avsecCourse,
    avsecQuestionBank: {
      ...avsecQuestionBank,
      questions: avsecQuestionBank.questions.map(normalizeQuestion)
    },
    avsecExam: evaluationsFile.evaluaciones.find((evaluation) => evaluation.curso_codigo === "CRS-AVSEC-001") || null,
    courses,
    evaluations: evaluationsFile.evaluaciones,
    defaultConfiguration: configurationFile.configuracion_inicial,
    equipment: base.equipment,
    calendarPattern: base.calendarPattern
  };
}
