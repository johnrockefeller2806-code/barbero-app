// FAQ content for Stuff Intercâmbio
// Organized by category with full translations

export const getFAQs = (language) => {
  const faqs = {
    pt: [
      {
        category: 'Sobre o Intercâmbio',
        icon: 'GraduationCap',
        questions: [
          {
            q: 'Quanto tempo dura um intercâmbio na Irlanda?',
            a: 'Os cursos variam de 8 a 25 semanas. O mais comum é o curso de 25 semanas, que permite trabalhar meio período (20h/semana durante aulas, 40h nas férias).'
          },
          {
            q: 'Preciso saber inglês para fazer intercâmbio?',
            a: 'Não! As escolas aceitam alunos de todos os níveis, desde iniciante até avançado. Você fará um teste de nivelamento no primeiro dia.'
          },
          {
            q: 'Qual a diferença entre a STUFF e uma agência tradicional?',
            a: 'Na STUFF, você fala diretamente com a escola, sem intermediários. Isso significa preços mais baixos, transparência total e comunicação direta. Não cobramos comissões escondidas.'
          }
        ]
      },
      {
        category: 'Pagamento e Matrícula',
        icon: 'CreditCard',
        questions: [
          {
            q: 'Como funciona o pagamento?',
            a: 'O pagamento é feito 100% online, de forma segura via Stripe. Você pode pagar com cartão de crédito internacional. Após a confirmação, você recebe um e-mail imediatamente.'
          },
          {
            q: 'Em quanto tempo recebo a carta da escola?',
            a: 'Após a confirmação do pagamento, a escola envia a carta oficial em até 5 dias úteis. Esta carta é necessária para seu processo de visto.'
          },
          {
            q: 'Posso parcelar o pagamento?',
            a: 'O parcelamento depende do seu cartão de crédito. Algumas bandeiras oferecem parcelamento automático. Também aceitamos pagamento em duas parcelas em casos especiais.'
          }
        ]
      },
      {
        category: 'Documentação',
        icon: 'FileText',
        questions: [
          {
            q: 'Preciso de visto para estudar na Irlanda?',
            a: 'Brasileiros não necessitam de visto para entrar na Irlanda como turista, com prazo máximo de 90 dias de permanência. Para permanecer por um período maior, é necessário realizar um intercâmbio seguindo as regras da imigração irlandesa.'
          },
          {
            q: 'O que é o GNIB/IRP?',
            a: 'É o registro de imigração obrigatório para estudantes não-europeus. Você precisa agendar no site do INIS e comparecer com seus documentos. O custo é €300.'
          },
          {
            q: 'O que é o PPS Number?',
            a: 'É como o CPF irlandês. Você precisa dele para trabalhar legalmente e para algumas questões fiscais. O processo é gratuito e você agenda online.'
          }
        ]
      },
      {
        category: '🛂 Turista → Estudante',
        icon: 'Plane',
        questions: [
          {
            q: 'Posso mudar de turista para estudante estando na Irlanda?',
            a: '❌ Não é permitido mudar automaticamente seu status de turista para visto de estudante estando na Irlanda. Segundo as regras de imigração irlandesas, entrar como turista com a intenção de depois pedir visto de estudante não é aceito pelas autoridades. A mudança de status geralmente exige que você solicite o visto fora do país.'
          },
          {
            q: 'O que é o visto de estudante (Stamp 2)?',
            a: '🎓 O Stamp 2 é a permissão de residência para estudantes na Irlanda. Com ele você pode: estudar em tempo integral em instituição reconhecida, trabalhar até 20h/semana durante aulas e 40h nas férias, permanecer legalmente no país durante seu curso. Para cursos de inglês longos, geralmente é necessário estudar no mínimo 25 semanas.'
          },
          {
            q: 'Quais documentos preciso para o visto de estudante?',
            a: '📄 Documentos essenciais:\n• Carta de aceitação da escola\n• Comprovante de pagamento do curso\n• Seguro saúde válido\n• Prova de recursos financeiros suficientes\n• Comprovante de acomodação\n• Passaporte válido\n• Intenção clara de estudo'
          },
          {
            q: 'Estou como turista na Irlanda. Como me organizar?',
            a: '✈️ Se você já está na Irlanda como turista e quer estudar, uma alternativa comum é:\n\n1. Organizar toda a documentação (escola, pagamento, seguro, comprovação financeira)\n2. Sair temporariamente da Irlanda para um país próximo da Europa\n3. Realizar o processo de entrada novamente seguindo as regras de imigração\n4. Retornar à Irlanda já com o objetivo correto de estudo\n\n📌 Países próximos costumam ter passagens mais baratas, tornando o processo mais acessível.'
          }
        ]
      },
      {
        category: 'Vida na Irlanda',
        icon: 'Home',
        questions: [
          {
            q: 'Quanto custa viver em Dublin?',
            a: 'O custo médio mensal é de €800-1200, incluindo acomodação compartilhada (€400-700), alimentação (€200-300), transporte (€100) e lazer (€100-200).'
          },
          {
            q: 'Posso trabalhar enquanto estudo?',
            a: 'Sim! Com o visto de estudante (Stamp 2), você pode trabalhar 20 horas por semana durante as aulas e 40 horas nas férias (junho-setembro e dezembro-janeiro).'
          },
          {
            q: 'Como é o clima na Irlanda?',
            a: 'O clima é temperado oceânico. Espere chuva frequente, temperaturas entre 5-20°C e pouca neve. Traga casacos impermeáveis e roupas em camadas!'
          }
        ]
      },
      {
        category: 'Trabalho',
        icon: 'Briefcase',
        questions: [
          {
            q: 'É fácil encontrar trabalho em Dublin?',
            a: 'Dublin tem muitas oportunidades, especialmente em hospitalidade, varejo e tecnologia. O salário mínimo é €12.70/hora. Ter inglês intermediário ajuda muito.'
          },
          {
            q: 'Preciso de currículo em inglês?',
            a: 'Sim! Prepare um CV no formato irlandês (sem foto, 1-2 páginas). Muitas escolas oferecem workshops de CV gratuitos para ajudar os alunos.'
          }
        ]
      }
    ],
    en: [
      {
        category: 'About Exchange',
        icon: 'GraduationCap',
        questions: [
          {
            q: 'How long does an exchange in Ireland last?',
            a: 'Courses range from 8 to 25 weeks. The most common is the 25-week course, which allows part-time work (20h/week during classes, 40h during holidays).'
          },
          {
            q: 'Do I need to know English to exchange?',
            a: 'No! Schools accept students of all levels, from beginner to advanced. You will take a placement test on the first day.'
          },
          {
            q: 'What is the difference between STUFF and a traditional agency?',
            a: 'At STUFF, you talk directly to the school, without intermediaries. This means lower prices, full transparency and direct communication. We do not charge hidden commissions.'
          }
        ]
      },
      {
        category: 'Payment & Enrollment',
        icon: 'CreditCard',
        questions: [
          {
            q: 'How does payment work?',
            a: 'Payment is 100% online, securely via Stripe. You can pay with an international credit card. After confirmation, you receive an email immediately.'
          },
          {
            q: 'How long does it take to receive the school letter?',
            a: 'After payment confirmation, the school sends the official letter within 5 business days. This letter is required for your visa process.'
          },
          {
            q: 'Can I pay in installments?',
            a: 'Installment payment depends on your credit card. Some brands offer automatic installments. We also accept payment in two installments in special cases.'
          }
        ]
      },
      {
        category: 'Documentation',
        icon: 'FileText',
        questions: [
          {
            q: 'Do I need a visa to study in Ireland?',
            a: 'Brazilians do not need a visa to enter Ireland as tourists, with a maximum stay of 90 days. To stay for a longer period, it is necessary to enroll in an exchange program following Irish immigration rules.'
          },
          {
            q: 'What is GNIB/IRP?',
            a: 'It is the mandatory immigration registration for non-European students. You need to book on the INIS website and attend with your documents. The cost is €300.'
          },
          {
            q: 'What is the PPS Number?',
            a: 'It is like the Irish Social Security Number. You need it to work legally and for some tax matters. The process is free and you book online.'
          }
        ]
      },
      {
        category: '🛂 Tourist → Student',
        icon: 'Plane',
        questions: [
          {
            q: 'Can I change from tourist to student while in Ireland?',
            a: '❌ It is not allowed to automatically change your status from tourist to student visa while in Ireland. According to Irish immigration rules, entering as a tourist with the intention of later applying for a student visa is not accepted by authorities. Changing status usually requires you to apply for the visa outside the country.'
          },
          {
            q: 'What is the student visa (Stamp 2)?',
            a: '🎓 Stamp 2 is the residence permit for students in Ireland. With it you can: study full-time at a recognized institution, work up to 20h/week during classes and 40h during holidays, stay legally in the country during your course. For long English courses, you usually need to study at least 25 weeks.'
          },
          {
            q: 'What documents do I need for the student visa?',
            a: '📄 Essential documents:\n• School acceptance letter\n• Proof of course payment\n• Valid health insurance\n• Proof of sufficient financial resources\n• Proof of accommodation\n• Valid passport\n• Clear intention to study'
          },
          {
            q: 'I am a tourist in Ireland. How do I organize myself?',
            a: '✈️ If you are already in Ireland as a tourist and want to study, a common alternative is:\n\n1. Organize all documentation (school, payment, insurance, financial proof)\n2. Temporarily leave Ireland for a nearby European country\n3. Go through the entry process again following immigration rules\n4. Return to Ireland with the correct purpose of study\n\n📌 Nearby countries usually have cheaper flights, making the process more accessible.'
          }
        ]
      },
      {
        category: 'Life in Ireland',
        icon: 'Home',
        questions: [
          {
            q: 'How much does it cost to live in Dublin?',
            a: 'The average monthly cost is €800-1200, including shared accommodation (€400-700), food (€200-300), transport (€100) and leisure (€100-200).'
          },
          {
            q: 'Can I work while studying?',
            a: 'Yes! With the student visa (Stamp 2), you can work 20 hours per week during classes and 40 hours during holidays (June-September and December-January).'
          },
          {
            q: 'What is the weather like in Ireland?',
            a: 'The climate is oceanic temperate. Expect frequent rain, temperatures between 5-20°C and little snow. Bring waterproof coats and layered clothing!'
          }
        ]
      },
      {
        category: 'Work',
        icon: 'Briefcase',
        questions: [
          {
            q: 'Is it easy to find work in Dublin?',
            a: 'Dublin has many opportunities, especially in hospitality, retail and technology. The minimum wage is €12.70/hour. Having intermediate English helps a lot.'
          },
          {
            q: 'Do I need a resume in English?',
            a: 'Yes! Prepare a CV in Irish format (no photo, 1-2 pages). Many schools offer free CV workshops to help students.'
          }
        ]
      }
    ],
    es: [
      {
        category: 'Sobre el Intercambio',
        icon: 'GraduationCap',
        questions: [
          {
            q: '¿Cuánto dura un intercambio en Irlanda?',
            a: 'Los cursos varían de 8 a 25 semanas. El más común es el curso de 25 semanas, que permite trabajar medio tiempo (20h/semana durante clases, 40h en vacaciones).'
          },
          {
            q: '¿Necesito saber inglés para hacer intercambio?',
            a: '¡No! Las escuelas aceptan estudiantes de todos los niveles, desde principiante hasta avanzado. Harás una prueba de nivel el primer día.'
          },
          {
            q: '¿Cuál es la diferencia entre STUFF y una agencia tradicional?',
            a: 'En STUFF, hablas directamente con la escuela, sin intermediarios. Esto significa precios más bajos, transparencia total y comunicación directa. No cobramos comisiones ocultas.'
          }
        ]
      },
      {
        category: 'Pago y Matrícula',
        icon: 'CreditCard',
        questions: [
          {
            q: '¿Cómo funciona el pago?',
            a: 'El pago es 100% online, de forma segura via Stripe. Puedes pagar con tarjeta de crédito internacional. Después de la confirmación, recibes un email inmediatamente.'
          },
          {
            q: '¿En cuánto tiempo recibo la carta de la escuela?',
            a: 'Después de la confirmación del pago, la escuela envía la carta oficial en hasta 5 días hábiles. Esta carta es necesaria para tu proceso de visa.'
          },
          {
            q: '¿Puedo pagar en cuotas?',
            a: 'El pago en cuotas depende de tu tarjeta de crédito. Algunas marcas ofrecen cuotas automáticas. También aceptamos pago en dos cuotas en casos especiales.'
          }
        ]
      },
      {
        category: 'Documentación',
        icon: 'FileText',
        questions: [
          {
            q: '¿Necesito visa para estudiar en Irlanda?',
            a: 'Los brasileños no necesitan visa para entrar en Irlanda como turistas, con un plazo máximo de 90 días de permanencia. Para permanecer por un período mayor, es necesario realizar un intercambio siguiendo las reglas de inmigración irlandesa.'
          },
          {
            q: '¿Qué es el GNIB/IRP?',
            a: 'Es el registro de inmigración obligatorio para estudiantes no europeos. Necesitas agendar en el sitio de INIS y asistir con tus documentos. El costo es €300.'
          },
          {
            q: '¿Qué es el PPS Number?',
            a: 'Es como el número de seguro social irlandés. Lo necesitas para trabajar legalmente y para algunas cuestiones fiscales. El proceso es gratuito y agendas online.'
          }
        ]
      },
      {
        category: '🛂 Turista → Estudiante',
        icon: 'Plane',
        questions: [
          {
            q: '¿Puedo cambiar de turista a estudiante estando en Irlanda?',
            a: '❌ No está permitido cambiar automáticamente tu status de turista a visa de estudiante estando en Irlanda. Según las reglas de inmigración irlandesas, entrar como turista con la intención de después pedir visa de estudiante no es aceptado por las autoridades. El cambio de status generalmente requiere que solicites la visa fuera del país.'
          },
          {
            q: '¿Qué es la visa de estudiante (Stamp 2)?',
            a: '🎓 El Stamp 2 es el permiso de residencia para estudiantes en Irlanda. Con él puedes: estudiar tiempo completo en una institución reconocida, trabajar hasta 20h/semana durante clases y 40h en vacaciones, permanecer legalmente en el país durante tu curso. Para cursos de inglés largos, generalmente es necesario estudiar mínimo 25 semanas.'
          },
          {
            q: '¿Qué documentos necesito para la visa de estudiante?',
            a: '📄 Documentos esenciales:\n• Carta de aceptación de la escuela\n• Comprobante de pago del curso\n• Seguro de salud válido\n• Prueba de recursos financieros suficientes\n• Comprobante de alojamiento\n• Pasaporte válido\n• Intención clara de estudio'
          },
          {
            q: 'Estoy como turista en Irlanda. ¿Cómo me organizo?',
            a: '✈️ Si ya estás en Irlanda como turista y quieres estudiar, una alternativa común es:\n\n1. Organizar toda la documentación (escuela, pago, seguro, comprobación financiera)\n2. Salir temporalmente de Irlanda a un país cercano de Europa\n3. Realizar el proceso de entrada nuevamente siguiendo las reglas de inmigración\n4. Retornar a Irlanda ya con el objetivo correcto de estudio\n\n📌 Países cercanos suelen tener pasajes más baratos, haciendo el proceso más accesible.'
          }
        ]
      },
      {
        category: 'Vida en Irlanda',
        icon: 'Home',
        questions: [
          {
            q: '¿Cuánto cuesta vivir en Dublín?',
            a: 'El costo promedio mensual es de €800-1200, incluyendo alojamiento compartido (€400-700), alimentación (€200-300), transporte (€100) y ocio (€100-200).'
          },
          {
            q: '¿Puedo trabajar mientras estudio?',
            a: '¡Sí! Con la visa de estudiante (Stamp 2), puedes trabajar 20 horas por semana durante las clases y 40 horas en vacaciones (junio-septiembre y diciembre-enero).'
          },
          {
            q: '¿Cómo es el clima en Irlanda?',
            a: 'El clima es templado oceánico. Espera lluvia frecuente, temperaturas entre 5-20°C y poca nieve. ¡Trae abrigos impermeables y ropa en capas!'
          }
        ]
      },
      {
        category: 'Trabajo',
        icon: 'Briefcase',
        questions: [
          {
            q: '¿Es fácil encontrar trabajo en Dublín?',
            a: 'Dublín tiene muchas oportunidades, especialmente en hospitalidad, retail y tecnología. El salario mínimo es €12.70/hora. Tener inglés intermedio ayuda mucho.'
          },
          {
            q: '¿Necesito currículum en inglés?',
            a: '¡Sí! Prepara un CV en formato irlandés (sin foto, 1-2 páginas). Muchas escuelas ofrecen workshops de CV gratuitos para ayudar a los estudiantes.'
          }
        ]
      }
    ]
  };

  return faqs[language] || faqs['en'];
};
