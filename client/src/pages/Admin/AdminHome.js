import React from "react";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";

const AdminHome = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Layout>
      <div className="container">
        <div className="d-felx flex-column mt-4">
          <h1>
            Welcome Admin <i className="text-success">{user?.name}</i>
          </h1>
          <h3>Manage Blood Bank App </h3>
          <hr />
          <p>
            The Admin Dashboard acts as a secure, role-based control layer that
            orchestrates the core functionalities of the Blood Bank Management
            System through a scalable and modular architecture. Built on the
            MERN stack, it enables real-time data visualization, centralized
            resource management, and seamless interaction with RESTful APIs for
            donors, hospitals, organizations, and blood inventory. With
            JWT-based authentication and protected routes, the system ensures
            robust access control and data integrity across all administrative
            operations. The dashboard provides dynamic CRUD operations,
            intelligent filtering, and status tracking for blood availability,
            request workflows, and donor activity, all backed by an optimized
            MongoDB database for high-performance querying. Advanced features
            such as asynchronous data fetching, responsive UI components, and
            state management deliver a smooth user experience while reducing
            operational latency. This interface empowers administrators with
            actionable insights, system analytics, and automated process
            handling, enabling efficient decision-making, improved traceability,
            and reliable emergency response. Designed with scalability,
            security, and maintainability in mind, the platform follows modern
            web development practices, promoting clean code structure, API
            reusability, and efficient deployment in a cloud-based environment.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHome;
