import {
  Button,
  VStack,
  Container,
  Box,
  useDisclosure,
  useBreakpointValue,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import CardTodos from "./pages/CardTodos";
import CreateTodoModal from "./pages/CreateTodoModal";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTodo, setSelectedTodo] = useState(null);
  const toast = useToast(); // Add toast for notifications

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5163/v1/todos?page=1&size=10"
        );
        if (response.data.responHeader.status) {
          setTodos(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleTodoCreated = async () => {
    const response = await axios.get(
      "http://localhost:5163/v1/todos?page=1&size=10"
    );
    if (response.data.responHeader.status) {
      setTodos(response.data.data);
    }
  };

  const numCols = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  if (loading) return <Text>Loading...</Text>;

  const handleEdit = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    setSelectedTodo(todo);
    onOpen(); // Open modal when editing
  };

  const handleComplete = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:5163/v1/todos/completed?id=${id}`
      );

      if (response.data) {
        // Update todo state to reflect changes
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, isCompleted: true } : todo
          )
        );

        toast({
          title: "Todo completed.",
          description: "The todo has been marked as completed.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error completing todo:", error);
      toast({
        title: "Error completing todo.",
        description: "There was an error completing the todo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      // Ganti endpoint dengan yang sesuai untuk DELETE
      const response = await axios.delete(
        `http://localhost:5163/v1/todos/${id}`
      );

      if (response.status === 200) {
        // Hapus todo dari state setelah berhasil dihapus
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

        toast({
          title: "Todo deleted.",
          description: "The todo has been removed.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast({
        title: "Error deleting todo.",
        description: "There was an error deleting the todo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <VStack sx={{ p: "4" }}>
        <Container
          maxW="4xl"
          bg="blue.600"
          color="white"
          sx={{ p: "4", borderRadius: "md" }}
        >
          <Button colorScheme="teal" onClick={onOpen}>
            Create TODOS
          </Button>
          <Box sx={{ p: "4", marginBottom: "2" }}>
            {todos.map((todo) => (
              <CardTodos
                id={todo.id} // Pass id to CardTodos
                title={todo.title}
                description={todo.description}
                duedate={todo.dueDate}
                reminder={todo.reminder}
                isCompleted={todo.isCompleted}
                key={todo.id}
                onEdit={handleEdit}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))}
          </Box>
        </Container>
      </VStack>
      <CreateTodoModal
        isOpen={isOpen}
        onClose={() => {
          setSelectedTodo(null); // Reset selectedTodo on close
          onClose();
        }}
        onTodoCreated={handleTodoCreated}
        todo={selectedTodo} // Pass selectedTodo to modal
      />
    </>
  );
}

export default App;
