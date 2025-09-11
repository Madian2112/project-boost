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
    const [messages, setMessages] = useState<{ author: 'user' | 'bot'; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
        // Añadimos un mensaje de bot vacío que se irá llenando
        setMessages((prev) => [...prev, { author: 'bot', content: '' }]);

        try {
            const response = await fetch('/.netlify/functions/ask-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: messageContent }),
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                const chunk = decoder.decode(value, { stream: true });
                
                setMessages((prevMessages) => {
                    const lastMessage = prevMessages[prevMessages.length - 1];
                    const updatedLastMessage = { ...lastMessage, content: lastMessage.content + chunk };
                    return [...prevMessages.slice(0, -1), updatedLastMessage];
                });
            }

        } catch (error) {
            console.error("Error fetching bot response:", error);
            setMessages((prev) => [...prev, { author: 'bot', content: 'Lo siento, algo salió mal. Por favor, intenta de nuevo.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
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
                </div>
            )}
        </div>
    );
};
