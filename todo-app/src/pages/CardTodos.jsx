import {
  Card,
  Image,
  Stack,
  CardBody,
  Text,
  CardFooter,
  Heading,
  Button,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons"; // Import icons from Chakra UI

function CardTodos({
  id,
  title,
  description,
  duedate,
  reminder,
  isCompleted,
  onEdit,
  onComplete,
  onDelete, // Function to handle delete
}) {
  return (
    <Box position="relative" mb={4}>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        backgroundColor={isCompleted ? "green.100" : "white"} // Change background color based on completion status
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
          alt="Caffe Latte"
        />

        <Stack>
          <CardBody>
            <Heading size="md">{title}</Heading>
            <Text py="2">{description}</Text>
            <Text py="2">Waktu tenggat : {duedate}</Text>
            <Text py="2">Waktu pengingat : {reminder}</Text>
          </CardBody>

          <CardFooter>
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={() => onEdit(id)}
            >
              Edit
            </Button>
            {!isCompleted && ( // Show check button only if not completed
              <IconButton
                colorScheme="green"
                icon={<CheckIcon />}
                onClick={() => onComplete(id)}
                aria-label="Complete Todo"
                ml={2}
              />
            )}
          </CardFooter>
        </Stack>
      </Card>

      <IconButton
        icon={<CloseIcon />}
        aria-label="Delete Todo"
        colorScheme="red"
        position="absolute"
        top={2}
        right={2}
        onClick={() => onDelete(id)}
        borderRadius="full"
      />
    </Box>
  );
}

export default CardTodos;
