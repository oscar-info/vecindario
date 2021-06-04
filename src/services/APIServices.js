//"use strict";

import axios from "axios";
import useAuth from "hooks/useAuth";
import { useCallback } from "react";
import { trackPromise } from 'react-promise-tracker';

export default function useAPI() {
  const { authToken } = useAuth();
  console.log(authToken)

  const getCurrentUser = useCallback(() => {
    return axios.get("https://app-vecindario.herokuapp.com/current_user", {
      headers: {
        Authorization: authToken,
      },
    });
  }, [authToken]);

  const getProjects = useCallback((id) => {
    return axios.get(`https://app-vecindario.herokuapp.com/projects_by_user_id/${id}`, {
      headers: {
        Authorization: authToken,
      },
    });
  }, [authToken]);

  const getProject = useCallback((id) => {
    return trackPromise( axios.get(`https://app-vecindario.herokuapp.com/projects/${id}`, {
      headers: {
        Authorization: authToken,
      },
    }));
  }, [authToken]);

  const createProject = useCallback((data) => {
    return trackPromise( axios.post("https://app-vecindario.herokuapp.com/projects", data, {
      headers: {
        Authorization: authToken,
      },
    }));
  }, [authToken]);

  const getLeads = useCallback((id) => {
    return trackPromise( axios.get(`https://app-vecindario.herokuapp.com/leads_by_project_id/${id}`));
  }, []);

  return { getProject, getProjects, getLeads, createProject, getCurrentUser };
}
