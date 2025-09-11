import { useState } from 'react';
import styles from './Chatbot.module.css';
import { Bot, X } from 'lucide-react';

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ author: 'user' | 'bot'; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { author: 'user' as const, content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/.netlify/functions/ask-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: input }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const botMessage = { author: 'bot' as const, content: data.answer };
            setMessages((prev) => [...prev, botMessage]);

        } catch (error) {
            console.error("Error fetching bot response:", error);
            const errorMessage = { author: 'bot' as const, content: 'Lo siento, algo salió mal. Por favor, intenta de nuevo.' };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button className={styles.chatbotToggler} onClick={toggleChat}>
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
                        {isLoading && <div className={`${styles.message} ${styles.bot}`}>...</div>}
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
                        <button type="submit" disabled={isLoading}>
                            Enviar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
