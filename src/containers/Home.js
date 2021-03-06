import React, { useState, useEffect } from "react";
import { Route, useHistory, useParams } from 'react-router-dom';
import "../assets/styles/components/Home.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CardProject from "../components/ProjectCard";
import axios from "axios";
import FormModal from "../components/FormModal";
import { useToasts } from 'react-toast-notifications';
import useAuth from "../hooks/useAuth";
import { trackPromise } from 'react-promise-tracker';
import LoadingSpinner from "components/LoadingSpinner";



function Home() {
  const history = useHistory();
  const { projectId } = useParams()
  const [projects, setProjects] = useState([]);
  const [setModalType] = useState(" ");
  const [setModalIsOpen] = useState(false);
  const [leads] = useState([]);
  const [user, setUser] = useState([]);
  const { addToast } = useToasts()
  const { handleAuth } = useAuth();


  function openModal(type) {
    setModalType(type);
    setModalIsOpen(true);
  }

  const getAllProjects = () => {
    trackPromise(
    axios.get(`${process.env.REACT_APP_API}/projects`).then((response) => {
      setProjects(response.data);
    })
    );
  };


  const createLead = (data) => {
    trackPromise(
    axios.post(`${process.env.REACT_APP_API}/leads`, {...data, project_id: projectId})
    .then((response) => {
      leads.push(response.data);
      addToast("Su informacion fue enviada exitosamente", {
        appearance: 'success',
        autoDismiss: true,
      })
      history.push('/')
    })
    .catch(() => {
      addToast("Su informacion no pudo ser enviada", {
        appearance: 'error',
        autoDismiss: true,
    })}));
  };

  const login = (data) => {
    trackPromise(
    axios.post(`${process.env.REACT_APP_API}/auth/login`, data)
    .then((response) => {
      handleAuth(response.data.token);
      history.push('/cms')
    })
    .catch((e) => {
      console.log(e)
      addToast("El email o contraseña es invalido", {
        appearance: 'error',
        autoDismiss: true,
    })}));
  };

  const createUser = (data) => {
    trackPromise(
    axios.post(`${process.env.REACT_APP_API}/users`, data)
    .then((response) => {
      user.push(response.data);
      setUser(response.data);
      addToast("El usuario fue creado exitosamente", {
        appearance: 'success',
        autoDismiss: true,
      })
      history.push('/auth/login')
    })
    .catch(() => {
      addToast("Su cuenta no pudo ser creada, verifique todos los campos", {
        appearance: 'error',
        autoDismiss: true,
    })}));
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <div className="home">
      <Header openModal={openModal} />
      <LoadingSpinner />
      <div className="container__projects">
        {projects.map((project) => {
          return <CardProject data={project} key={project.id} openModal={openModal} />;
        })}
      </div>
      <Footer />
      <Route
        exact
        path="/auth/login"
        component={() => (
          <FormModal
            type={'login'}
            isOpen={true}
            onSubmit={(data) => {
              login(data);
            }}
            onRequestClose={()=> history.push('/')}
          />
        )}
      />
      <Route
        exact
        path="/registrarse"
        component={() => (
          <FormModal
            type={'register'}
            isOpen={true}
            onSubmit={(data) => {
              createUser(data);
            }}
            onRequestClose={()=> history.push('/')}
          />
        )}
      />
      <Route
        exact
        path="/leads/:projectId"
        component={() => (
          <FormModal
            type={'lead'}
            isOpen={true}
            onSubmit={(data) => {
              createLead(data);
            }}
            onRequestClose={()=> history.push('/')}
          />
        )}
      />
    </div>
  );
}

export default Home;
