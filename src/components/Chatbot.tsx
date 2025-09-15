import { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';
import { Bot, X, Send } from 'lucide-react';

const suggestedQuestions = [
    "¿Qué servicios ofrecen?",
    "¿Cuál es su proceso de trabajo?",
    "¿Quiénes forman el equipo?",
];

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ author: 'user' | 'bot'; content: string | React.ReactNode }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [promptForEmail, setPromptForEmail] = useState(false);
    const [lastQuestion, setLastQuestion] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setIsLoading(true);
            setTimeout(() => {
                setMessages([{ author: 'bot', content: '¡Hola! Soy BoostBot, el asistente virtual de Project Boost. ¿En qué puedo ayudarte hoy?' }]);
                setIsLoading(false);
            }, 500);
        }
    }, [isOpen]);

    const handleSendMessage = async (messageContent: string) => {
        if (!messageContent.trim() || isLoading) return;

        const userMessage = { author: 'user' as const, content: messageContent };
        setMessages((prev) => [...prev, userMessage]);
        if (input) setInput('');
        setIsLoading(true);
        setLastQuestion(messageContent); // Guardamos la pregunta

        try {
            const response = await fetch('/.netlify/functions/ask-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: messageContent }),
            });

            if (!response.ok) {
                // Capturamos errores de red o errores 500 del servidor aquí
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido al procesar la respuesta' }));
                throw new Error(errorData.error || 'La respuesta de la red no fue correcta');
            }

            const data = await response.json();
            const aiJson = JSON.parse(data.answer.match(/\{[\s\S]*\}/)?.[0] || "{}");

            if (aiJson.isImportantLead) {
                setMessages(prev => [...prev, { author: 'bot', content: aiJson.responseForUser }]);
                setPromptForEmail(true); // Activamos el formulario de email
            } else {
                setMessages(prev => [...prev, { author: 'bot', content: aiJson.responseForUser }]);
            }

        } catch (error) {
            console.error("Error al obtener la respuesta del bot:", error);
            const errorMessageContent = error instanceof Error ? error.message : 'Lo siento, algo salió mal. Por favor, intenta de nuevo.';
            const errorMessage = { author: 'bot' as const, content: errorMessageContent };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
    };

    const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userEmail = e.currentTarget.email.value;
        
        setPromptForEmail(false);
        setMessages(prev => [...prev, { author: 'bot', content: "¡Gracias! Hemos recibido tu correo. El equipo se pondrá en contacto contigo pronto." }]);

        await fetch('/.netlify/functions/notify-ceos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: lastQuestion, userEmail }),
        });
    };

    const handleSkipEmail = async () => {
        setPromptForEmail(false);
        setMessages(prev => [...prev, { author: 'bot', content: "Entendido. Si cambias de opinión, siempre puedes contactarnos directamente." }]);

        await fetch('/.netlify/functions/notify-ceos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: lastQuestion }), // Enviamos sin email
        });
    };

    return (
        <div>
            <button className={styles.chatbotToggler} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} /> : <Bot size={28} />}
            </button>

            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>
                        <h3>Asistente Virtual</h3>
                        <p>Project Boost</p>
                    </div>
                    <div className={styles.chatMessages}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`${styles.message} ${styles[msg.author]}`}>
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && messages[messages.length - 1]?.author === 'user' && (
                            <div className={`${styles.message} ${styles.bot} ${styles.loading}`}>
                                <span></span><span></span><span></span>
                            </div>
                        )}
                        {/* Contenedor de preguntas sugeridas */}
                        {messages.length === 1 && !isLoading && (
                            <div className={styles.suggestions}>
                                {suggestedQuestions.map((q) => (
                                    <button key={q} className={styles.suggestionButton} onClick={() => handleSendMessage(q)}>
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    {promptForEmail ? (
                        <div className={styles.emailFormContainer}>
                            <p>Para darte una respuesta detallada, ¿te gustaría dejarnos tu email? (Opcional)</p>
                            <form onSubmit={handleEmailSubmit}>
                                <input type="email" name="email" placeholder="tu@email.com" required />
                                <button type="submit">Enviar Email</button>
                            </form>
                            <button onClick={handleSkipEmail} className={styles.skipButton}>No, gracias</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.chatInputForm}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Haz una pregunta..."
                                aria-label="Escribe tu mensaje"
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={isLoading || !input.trim()}>
                                <Send size={20} />
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};
