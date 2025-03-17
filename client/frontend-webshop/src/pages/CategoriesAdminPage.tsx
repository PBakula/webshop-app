import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { categoryService } from "../services/categoryService";
import { Category } from "../types/models";

const CategoriesAdminPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({
    name: "",
  });
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError("Error occurred while fetching categories, please try again");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setCurrentCategory({
      name: "",
    });
    setModalTitle("Add new category");
    setModalError(null);
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setCurrentCategory({ ...category });
    setModalTitle("Edit cateogry");
    setModalError(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const openDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: value,
    });
  };

  const handleSaveCategory = async () => {
    try {
      setModalLoading(true);
      setModalError(null);

      if (!currentCategory.name) {
        setModalError("Category name is required");
        setModalLoading(false);
        return;
      }

      if (currentCategory.id) {
        await categoryService.updateCategory(
          currentCategory.id,
          currentCategory
        );
      } else {
        await categoryService.createCategory(currentCategory);
      }

      handleModalClose();
      fetchCategories();
    } catch (err) {
      setModalError(
        err instanceof Error
          ? err.message
          : "Error occured while saving category, please try again"
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setLoading(true);
      await categoryService.deleteCategory(categoryToDelete.id);
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
      handleDeleteModalClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error occured while deleting, please try again."
      );
      handleDeleteModalClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>Categories edit</h1>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={openAddModal}>
            <FaPlus className="me-1" /> Add new cateogry
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          {loading && (
            <div className="text-center py-3">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}

          {!loading && categories.length === 0 ? (
            <div className="text-center py-3">
              <p className="text-muted">No categories to display</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.name}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openEditModal(category)}
                          className="me-2"
                        >
                          <FaEdit /> Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => openDeleteModal(category)}
                        >
                          <FaTrash /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Category Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category title*</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentCategory.name || ""}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveCategory}
            disabled={modalLoading}
          >
            {modalLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categoryToDelete && (
            <p>
              Are you sure you want to delete{" "}
              <strong>{categoryToDelete.name}</strong>? You can't cancel this
              action. If category contains products, deleting won't be possible.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCategory}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CategoriesAdminPage;
