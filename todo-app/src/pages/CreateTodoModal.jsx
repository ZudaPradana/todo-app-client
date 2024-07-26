import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateTodoModal({ isOpen, onClose, onTodoCreated, todo }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminder, setReminder] = useState("");
  const [status, setStatus] = useState(false); // Default status to InProgress (false)
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Set nilai form berdasarkan tugas yang dipilih
  useEffect(() => {
    if (todo) {
      setTitle(todo.title || "");
      setDescription(todo.description || "");
      setDueDate(todo.dueDate ? todo.dueDate.split(".")[0] : ""); // Menghapus milidetik dari dueDate
      setReminder(todo.reminder ? todo.reminder.split(".")[0] : ""); // Menghapus milidetik dari reminder
      setStatus(todo.isCompleted); // Set status berdasarkan tugas yang dipilih
    } else {
      // Set nilai form ke default ketika tugas tidak dipilih
      setTitle("");
      setDescription("");
      setDueDate("");
      setReminder("");
      setStatus(false); // Default status untuk tugas baru adalah InProgress
    }
  }, [todo]);

  // Menangani pengiriman form
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null;
    const formattedReminder = reminder
      ? new Date(reminder).toISOString()
      : null;
    try {
      // Gunakan metode PATCH jika todo sudah ada (edit), atau POST jika membuat todo baru
      const endpoint = todo
        ? `http://localhost:5163/v1/todos/${todo.id}` // Endpoint dengan query parameter untuk PATCH
        : "http://localhost:5163/v1/todos";
      const method = todo ? "patch" : "post";

      const response = await axios[method](endpoint, {
        title,
        description: description === "" ? null : description,
        dueDate: formattedDueDate,
        reminder: formattedReminder,
        isCompleted: status, // Gunakan status dari form
      });

      if (response.data) {
        toast({
          title: `Todo ${todo ? "updated" : "created"}.`,
          description: `Your todo has been ${todo ? "updated" : "created"}.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onTodoCreated(); // Memanggil ulang data todo dari server
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error saving todo.",
        description: "There was an error saving your todo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{todo ? "Edit Todo" : "Create New Todo"}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl mb="4" isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Due Date</FormLabel>
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Reminder</FormLabel>
              <Input
                type="datetime-local"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Status</FormLabel>
              <Select
                value={status ? "Completed" : "InProgress"}
                onChange={(e) => setStatus(e.target.value === "Completed")}
              >
                <option value="InProgress">InProgress</option>
                <option value="Completed">Completed</option>
              </Select>
            </FormControl>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                isLoading={loading}
              >
                {todo ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default CreateTodoModal;
