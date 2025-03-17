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
  Badge,
  InputGroup,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import { Product, Category, ProductFilters } from "../types/models";
import { ProductSort } from "../components/products/ProductSort";

const ProductsAdminPage: React.FC = () => {
  // States for product list
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [categories, setCategories] = useState<Category[]>([]);

  // States for product modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // States for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Re-fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts(filters);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(
        "Došlo je do pogreške pri dohvaćanju proizvoda. Molimo pokušajte ponovno."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError("Došlo je do pogreške pri dohvaćanju kategorija.");
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setCurrentProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: categories.length > 0 ? categories[0].id : 0,
    });
    setImageFile(null);
    setModalTitle("Add new product");
    setModalError(null);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct({ ...product });
    setImageFile(null);
    setModalTitle("Edit product");
    setModalError(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "price" || name === "stock") {
      setCurrentProduct({
        ...currentProduct,
        [name]: parseFloat(value) || 0,
      });
    } else if (name === "categoryId") {
      setCurrentProduct({
        ...currentProduct,
        [name]: parseInt(value) || 0,
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSaveProduct = async () => {
    try {
      setModalLoading(true);
      setModalError(null);

      if (
        !currentProduct.name ||
        !currentProduct.description ||
        !currentProduct.price ||
        currentProduct.price <= 0
      ) {
        setModalError("Please fill out the product info");
        setModalLoading(false);
        return;
      }

      if (currentProduct.id) {
        await productService.updateProduct(
          currentProduct.id,
          currentProduct,
          imageFile || undefined
        );
      } else {
        await productService.createProduct(
          currentProduct,
          imageFile || undefined
        );
      }

      handleModalClose();
      fetchProducts();
    } catch (err) {
      setModalError(
        err instanceof Error
          ? err.message
          : "Error saving product, please try again."
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setLoading(true);
      await productService.deleteProduct(productToDelete.id);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      handleDeleteModalClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error deleting product, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>Products edit</h1>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={openAddModal}>
            <FaPlus className="me-1" /> Add new product
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Header>
          <ProductSort
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </Card.Header>
        <Card.Body>
          {loading && (
            <div className="text-center py-3">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">loading...</span>
              </Spinner>
            </div>
          )}

          {!loading && products.length === 0 ? (
            <div className="text-center py-3">
              <p className="text-muted">No products to display</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Picture</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td className="text-center">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                              height: "50px",
                              width: "auto",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <span className="text-muted">No picture</span>
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>
                        {categories.find((c) => c.id === product.categoryId)
                          ?.name || "-"}
                      </td>
                      <td>{product.price.toFixed(2)} €</td>
                      <td>
                        {product.stock > 0 ? (
                          <Badge bg="success">{product.stock} </Badge>
                        ) : (
                          <Badge bg="danger">Out of stock</Badge>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openEditModal(product)}
                          className="me-2"
                        >
                          <FaEdit /> Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => openDeleteModal(product)}
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

      {/* Product Modal */}
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Naziv proizvoda*</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={currentProduct.name || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kategorija*</Form.Label>
                  <Form.Select
                    name="categoryId"
                    value={currentProduct.categoryId || ""}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Odaberi kategoriju</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Opis proizvoda*</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={currentProduct.description || ""}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cijena (€)*</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      name="price"
                      value={currentProduct.price || ""}
                      onChange={handleInputChange}
                      required
                    />
                    <InputGroup.Text>€</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stanje na skladištu*</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="stock"
                    value={currentProduct.stock || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Slika proizvoda</Form.Label>
              {currentProduct.imageUrl && (
                <div className="mb-2">
                  <img
                    src={currentProduct.imageUrl}
                    alt={currentProduct.name}
                    style={{
                      height: "100px",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                  <p className="text-muted small mt-1">
                    Postojeća slika. Odaberite novu za zamjenu.
                  </p>
                </div>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Form.Text className="text-muted">
                Maksimalna veličina slike: 2MB
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Odustani
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveProduct}
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
                Spremanje...
              </>
            ) : (
              "Spremi"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Potvrda brisanja</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productToDelete && (
            <p>
              Jeste li sigurni da želite obrisati proizvod{" "}
              <strong>{productToDelete.name}</strong>? Ova akcija se ne može
              poništiti.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Odustani
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            Obriši
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductsAdminPage;
