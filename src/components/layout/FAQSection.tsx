"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/Accordion";

const questions = [
    {
        question: "É gratuito?",
        answer: "Sim, a Capadura é totalmente gratuita. Não há taxas ocultas ou cobranças de assinatura.",
    },
    {
        question: "A Capadura possui um aplicativo?",
        answer: "Ainda não, estamos trabalhando nisso e em breve lançaremos um aplicativo para Android e iOS.",
    },
    {
        question: "Existem recomendações de livros dentro da plataforma?",
        answer: "Sim, a Capadura oferece recomendações personalizadas de livros com base em seu histórico de leitura e preferências. Você também pode explorar listas de livros criadas por outros usuários para descobrir novos livros.",
    },
    {
        question: "Posso escrever resenhas de livros?",
        answer: "Com certeza! Você pode escrever e publicar resenhas de livros para compartilhar suas opiniões e pensamentos com a comunidade da Capadura. Suas resenhas aparecerão na página do livro e na seção de resenhas do seu perfil.",
    },
    {
        question: "Como adicionar livros favoritos ao meu perfil?",
        answer: 'Entre no seu perfil, clique em "Adicionar livro" e pesquise pelo título do livro. Assim que encontrá-lo, clique nele e terá a opção de adicioná-lo ao seu perfil.',
    },
];

export function FAQSection() {
    return (
        <div className="mx-auto w-full max-w-2xl py-12 lg:py-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl lg:text-center">
                Perguntas frequentes
            </h2>
            <Accordion type="single" collapsible className="w-full">
                {questions.map((question) => (
                    <AccordionItem key={question.question} value={question.question}>
                        <AccordionTrigger>{question.question}</AccordionTrigger>
                        <AccordionContent>{question.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
