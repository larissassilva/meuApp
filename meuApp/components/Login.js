import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaLock, FaExclamationCircle } from 'react-icons/fa';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setErro('');
        setLoading(true);

        if (!email || !senha) {
            setErro('Preencha todos os campos.');
            setLoading(false);
            return;
        }

        try {
            // Assuming the API expects raw JSON or form-data. 
            // Based on App.js, it seems standard JSON post is used.
            // Adjust the URL if needed.
            const response = await axios.post('http://localhost/apireact/login.php', {
                email: email,
                senha: senha
            });

            if (response.data && typeof response.data === 'object' && response.data.success) {
                onLogin(response.data.user || {}, response.data.token); // Pass user data and token
            } else {
                if (typeof response.data === 'string') {
                    console.warn("Resposta não-JSON do servidor:", response.data);
                }
                setErro(response.data?.message || 'Email ou senha incorretos.');
            }
        } catch (error) {
            console.error("Erro no Login:", error);
            setErro('Erro de conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f0f2f5' }}>
            <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
                <div className="text-center mb-4">
                    <img src="https://midiajatai.com.br/logo-sitemodelonovo.png" alt="Logo" style={{ width: '40%', objectFit: 'contain', marginBottom: '0px' }} />
                    <h2 style={{ fontWeight: 'bold', color: '#333', marginTop: '0px' }}>Login</h2>
                    <p className="text-muted">Acesse o sistema</p>
                </div>

                {erro && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                        <FaExclamationCircle className="mr-2" />
                        <div>{erro}</div>
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3">
                        <label htmlFor="email" style={{ fontWeight: 500 }}>Email</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white"><FaUser /></span>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <label htmlFor="senha" style={{ fontWeight: 500 }}>Senha</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white"><FaLock /></span>
                            <input
                                type="password"
                                className="form-control"
                                id="senha"
                                placeholder="******"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block w-100 btn-lg"
                        style={{ borderRadius: '50px', fontWeight: 'bold' }}
                        disabled={loading}
                    >
                        {loading ? 'Carregando...' : 'Entrar'}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <small className="text-muted">Esqueceu a senha? Contate o admin, <a href="https://midiajatai.com.br" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>clique aqui.</a></small>
                </div>
            </div>
        </div>
    );
}

export default Login;
