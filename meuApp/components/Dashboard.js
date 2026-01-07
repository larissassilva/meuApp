import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, ScrollView } from 'react-native';
import { FaCheckCircle, FaTrash, FaPen, FaPlus, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard({ onLogout, token }) {
    const [lista, setLista] = useState([]);
    const [cpf, setCPF] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [id, setId] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
    const [modalSucessoAberto, setModalSucessoAberto] = useState(false);
    const [modalSucessoEditarAberto, setModalSucessoEditarAberto] = useState(false);
    const [modalSucessoExcluirAberto, setModalSucessoExcluirAberto] = useState(false);
    const [modalErroAberto, setModalErroAberto] = useState(false);
    const [mensagemErro, setMensagemErro] = useState('');
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState(null);

    useEffect(() => {
        console.log("Dashboard loaded. Token:", token);
        listarDados();
    }, [token]);

    async function listarDados() {
        try {
            const res = await axios.post('http://localhost/apireact/listar.php', {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.data && Array.isArray(res.data.result)) {
                setLista(res.data.result);
                console.log(res.data.result);
            } else {
                console.warn("Resposta da API inválida:", res.data);
                setLista([]);
            }
        } catch (error) {
            console.error("Erro ao listar:", error.message);
            if (error.response) {
                console.error("Dados do erro:", error.response.data);
                console.error("Status do erro:", error.response.status);
                setMensagemErro(error.response.data.message || "Erro ao listar dados.");
            } else {
                setMensagemErro("Erro ao listar: " + error.message);
            }
            setModalErroAberto(true);
            setLista([]);
        }
    }

    function abrirModalCadastro() {
        limparCampos();
        setModalCadastroAberto(true);
    }

    async function editarDados(idUsuario) {
        const usuario = lista.find(item => item.id === idUsuario);
        if (usuario) {
            setId(usuario.id);
            setCPF(usuario.cpf);
            setNome(usuario.nome);
            setEmail(usuario.email);
            setSenha(usuario.senha);
            setModalAberto(true);
        }
    }

    async function adicionarDados() {
        try {
            const dados = {
                cpf: cpf,
                nome: nome,
                email: email,
                senha: senha
            };
            const res = await axios.post('http://localhost/apireact/adicionar.php', dados, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.data.success) {
                setModalCadastroAberto(false);
                setModalSucessoAberto(true);
                listarDados();
                limparCampos();
            } else {
                setMensagemErro(res.data.message || 'Erro ao cadastrar usuário');
                setModalErroAberto(true);
            }
        } catch (error) {
            setMensagemErro('Erro ao conectar com o servidor');
            setModalErroAberto(true);
        }
    }

    function fecharModalSucesso() {
        setModalSucessoAberto(false);
    }

    function fecharModalSucessoEditar() {
        setModalSucessoEditarAberto(false);
    }

    function fecharModalSucessoExcluir() {
        setModalSucessoExcluirAberto(false);
    }

    function fecharModalErro() {
        setModalErroAberto(false);
        setMensagemErro('');
    }

    async function atualizarDados() {
        try {
            const dados = {
                id: id,
                cpf: cpf,
                nome: nome,
                email: email,
                senha: senha
            };
            const res = await axios.post('http://localhost/apireact/editar.php', dados, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.data.success) {
                setModalAberto(false);
                setModalSucessoEditarAberto(true);
                listarDados();
                limparCampos();
            } else {
                setMensagemErro(res.data.message || 'Erro ao atualizar usuário');
                setModalErroAberto(true);
            }
        } catch (error) {
            setMensagemErro('Erro ao conectar com o servidor');
            setModalErroAberto(true);
        }
    }

    function abrirModalExcluir(idUsuario) {
        setIdParaExcluir(idUsuario);
        setModalExcluirAberto(true);
    }

    function fecharModalExcluir() {
        setModalExcluirAberto(false);
        setIdParaExcluir(null);
    }

    async function confirmarExclusao() {
        try {
            if (idParaExcluir) {
                const res = await axios.post('http://localhost/apireact/excluir.php', { id: idParaExcluir }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.data.success) {
                    fecharModalExcluir();
                    setModalSucessoExcluirAberto(true);
                    listarDados();
                } else {
                    setMensagemErro(res.data.message || 'Erro ao excluir usuário');
                    setModalErroAberto(true);
                }
            }
        } catch (error) {
            setMensagemErro('Erro ao conectar com o servidor');
            setModalErroAberto(true);
        }
    }

    function limparCampos() {
        setId('');
        setCPF('');
        setNome('');
        setEmail('');
        setSenha('');
    }

    function fecharModal() {
        setModalAberto(false);
        limparCampos();
    }

    function fecharModalCadastro() {
        setModalCadastroAberto(false);
        limparCampos();
    }


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <div style={{ backgroundColor: '#000', width: '100%', padding: '5px 0', textAlign: 'center', marginBottom: '0', top: 0, left: 0, right: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '20px', paddingRight: '20px' }}>
                <span style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>Mídia Jataí</span>
                <button className='btn btn-outline-light btn-sm' onClick={onLogout}>Sair</button>
            </div>
            <h2 style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>Painel Administrativo</h2>
            <div className='container' style={{ paddingTop: '60px', marginTop: '0', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '60px' }}>
                <div className="col-md-12 p-2" style={{ marginBottom: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
                    <ul className='list-group'>
                        {lista.map(item => (
                            <React.Fragment key={item.id}>
                                <li className='list-group-item'>
                                    <span style={{ fontWeight: 'bold' }}>Nome:</span> {item.nome}
                                </li>
                                <li className='list-group-item'>
                                    <span style={{ fontWeight: 'bold' }}>CPF:</span> {item.cpf}
                                </li>
                                <li className='list-group-item'>
                                    <span style={{ fontWeight: 'bold' }}>Email:</span> {item.email}
                                </li>
                                <li className='list-group-item'>
                                    <span style={{ fontWeight: 'bold' }}>Senha:</span> <input type='password' value={item.senha} readOnly style={{ border: 'none', background: 'transparent', outline: 'none' }} />
                                </li>
                                <li className='list-group-item'>
                                    <button className='btn btn-outline-primary btn-sm mr-2' onClick={() => editarDados(item.id)}> <FaPen /> Editar</button>&nbsp;&nbsp;
                                    <button className='btn btn-outline-danger btn-sm' onClick={() => abrirModalExcluir(item.id)}> <FaTrash /> Excluir</button>
                                </li>
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
                <div className="col-md-12 p-2" style={{ textAlign: 'center' }}>
                    <button className='btn btn-outline-success btn-lg' style={{ width: '100%' }} onClick={() => abrirModalCadastro()}> <FaPlus /> Adicionar</button>
                </div>
            </div>
            <div style={{ backgroundColor: '#000', width: '100%', padding: '10px 0', textAlign: 'center', bottom: 0, left: 0, right: 0 }}>
                <span style={{ color: '#fff', fontSize: '14px' }}>Desenvolvido por <a href='https://midiajatai.com.br' target='_blank' rel='noopener noreferrer' style={{ color: '#fff', textDecoration: 'none' }}>Mídia Jataí</a></span>
            </div>

            {/* Modal de Edição */}
            {modalAberto && (
                <div className='modal' style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={fecharModal}>
                    <div className='modal-dialog' onClick={(e) => e.stopPropagation()}>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>Editar Usuário</h5>
                            </div>
                            <div className='modal-body'>
                                <form>
                                    <div className='form-group'>
                                        <label htmlFor='nome'>Nome</label>
                                        <input type='text' className='form-control' id='nome' value={nome} onChange={(e) => setNome(e.target.value)} />
                                    </div>
                                    <div className='form-group'>
                                        <label htmlFor='cpf'>CPF</label>
                                        <input type='text' className='form-control' id='cpf' value={cpf} onChange={(e) => setCPF(e.target.value)} />
                                    </div>
                                    <div className='form-group'>
                                        <label htmlFor='email'>Email</label>
                                        <input type='email' className='form-control' id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className='form-group'>
                                        <label htmlFor='senha'>Senha</label>
                                        <input type='password' className='form-control' id='senha' value={senha} onChange={(e) => setSenha(e.target.value)} />
                                    </div>
                                </form>
                            </div>
                            <div className='modal-footer'>
                                <button type='button' className='btn btn-secondary' onClick={fecharModal}>Fechar</button>
                                <button type='button' className='btn btn-primary' onClick={atualizarDados}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Cadastro */}
            {modalCadastroAberto && (
                <div className='modal' style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={fecharModalCadastro}>
                    <div className='modal-dialog' onClick={(e) => e.stopPropagation()}>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>Adicionar Novo Usuário</h5>
                            </div>
                            <div className='modal-body'>
                                <form>
                                    <div className='form-group'>
                                        <label htmlFor='nomeNovo'>Nome</label>
                                        <input type='text' className='form-control' id='nomeNovo' value={nome} onChange={(e) => setNome(e.target.value)} />
                                    </div>
                                    <div className='form-group'>
                                        <label htmlFor='cpfNovo'>CPF</label>
                                        <input type='text' className='form-control' id='cpfNovo' value={cpf} onChange={(e) => setCPF(e.target.value)} />
                                    </div>
                                    <div className='form-group'>
                                        <label htmlFor='emailNovo'>Email</label>
                                        <input type='email' className='form-control' id='emailNovo' value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className='form-group'>
                                        <label htmlFor='senhaNovo'>Senha</label>
                                        <input type='password' className='form-control' id='senhaNovo' value={senha} onChange={(e) => setSenha(e.target.value)} />
                                    </div>
                                </form>
                            </div>
                            <div className='modal-footer'>
                                <button type='button' className='btn btn-secondary' onClick={fecharModalCadastro}>Cancelar</button>
                                <button type='button' className='btn btn-success' onClick={adicionarDados}>Cadastrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Sucesso */}
            {modalSucessoAberto && (
                <div className='modal' style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={fecharModalSucesso}>
                    <div className='modal-dialog modal-dialog-centered' onClick={(e) => e.stopPropagation()}>
                        <div className='modal-content'>
                            <div className='modal-body text-center p-4'>
                                <FaCheckCircle style={{ fontSize: '64px', color: '#28a745', marginBottom: '20px' }} />
                                <h5 className='mb-3'>Usuário cadastrado com sucesso!</h5>
                                <button type='button' className='btn btn-success' onClick={fecharModalSucesso}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Sucesso - Editar */}
            {modalSucessoEditarAberto && (
                <div className='modal' style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={fecharModalSucessoEditar}>
                    <div className='modal-dialog modal-dialog-centered' onClick={(e) => e.stopPropagation()}>
                        <div className='modal-content'>
                            <div className='modal-body text-center p-4'>
                                <FaCheckCircle style={{ fontSize: '64px', color: '#28a745', marginBottom: '20px' }} />
                                <h5 className='mb-3'>Usuário atualizado com sucesso!</h5>
                                <button type='button' className='btn btn-success' onClick={fecharModalSucessoEditar}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Sucesso - Excluir */}
            {modalSucessoExcluirAberto && (
                <div className='modal' style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={fecharModalSucessoExcluir}>
                    <div className='modal-dialog modal-dialog-centered' onClick={(e) => e.stopPropagation()}>
                        <div className='modal-content'>
                            <div className='modal-body text-center p-4'>
                                <FaCheckCircle style={{ fontSize: '64px', color: '#28a745', marginBottom: '20px' }} />
                                <h5 className='mb-3'>Usuário excluído com sucesso!</h5>
                                <button type='button' className='btn btn-success' onClick={fecharModalSucessoExcluir}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Erro */}
            {modalErroAberto && (
                <div className='modal' style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={fecharModalErro}>
                    <div className='modal-dialog modal-dialog-centered' onClick={(e) => e.stopPropagation()}>
                        <div className='modal-content'>
                            <div className='modal-body text-center p-4'>
                                <FaExclamationCircle style={{ fontSize: '64px', color: '#dc3545', marginBottom: '20px' }} />
                                <h5 className='mb-3'>Erro!</h5>
                                <p className='text-muted'>{mensagemErro}</p>
                                <button type='button' className='btn btn-danger' onClick={fecharModalErro}>Fechar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {modalExcluirAberto && (
                <div className='modal' style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={fecharModalExcluir}>
                    <div className='modal-dialog modal-dialog-centered' onClick={(e) => e.stopPropagation()}>
                        <div className='modal-content'>
                            <div className='modal-body text-center p-4'>
                                <FaTrash style={{ fontSize: '64px', color: '#dc3545', marginBottom: '20px' }} />
                                <h5 className='mb-3'>Deseja realmente excluir este usuário?</h5>
                                <p className='text-muted'>Esta ação não pode ser desfeita.</p>
                                <div className='mt-4'>
                                    <button type='button' className='btn btn-secondary mr-2' onClick={fecharModalExcluir}>Cancelar</button>&nbsp;&nbsp;
                                    <button type='button' className='btn btn-danger' onClick={confirmarExclusao}>Excluir</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ScrollView>
    );
}

export default Dashboard;
