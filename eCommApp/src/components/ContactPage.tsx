import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [request, setRequest] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowPopup(true);
    };

    const handleContinue = () => {
        setName('');
        setEmail('');
        setRequest('');
        setShowPopup(false);
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="contact-container">
                    <h2>Fale Conosco</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <input
                            type="text"
                            placeholder="Seu nome"
                            aria-label="Seu nome"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Seu e-mail"
                            aria-label="Seu e-mail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Sua solicitação"
                            aria-label="Sua solicitação"
                            value={request}
                            onChange={e => setRequest(e.target.value)}
                            required
                        />
                        <button type="submit">Enviar</button>
                    </form>
                </div>
            </main>
            {showPopup && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <p>Obrigado por sua mensagem</p>
                        <button onClick={handleContinue}>Continuar</button>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default ContactPage;
