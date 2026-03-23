import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [request, setRequest] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleContinue = () => {
        setShowModal(false);
        setName('');
        setEmail('');
        setRequest('');
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
                            placeholder="Nome"
                            aria-label="Nome"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="E-mail"
                            aria-label="E-mail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Solicitação"
                            aria-label="Solicitação"
                            value={request}
                            onChange={e => setRequest(e.target.value)}
                            rows={5}
                            required
                        />
                        <button type="submit">Enviar</button>
                    </form>
                </div>
            </main>
            <Footer />

            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <p>Obrigado por sua mensagem</p>
                        <div className="checkout-modal-actions">
                            <button onClick={handleContinue}>Continuar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactPage;
