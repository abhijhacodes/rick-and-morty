import Head from "next/head";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import Character from "../components/Character";
import {
  Heading,
  Box,
  Flex,
  Input,
  Stack,
  IconButton,
  useToast,
  Link,
  useColorMode,
  Text,
} from "@chakra-ui/react";
import {
  SearchIcon,
  CloseIcon,
  MoonIcon,
  SunIcon,
  ArrowUpIcon,
} from "@chakra-ui/icons";

export default function Home(results) {
  const initialData = results;
  const [characters, setCharacters] = useState(initialData.characters);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex direction="column" justify="center" align="center">
      <Head>
        <title>Rick & Morty</title>
      </Head>

      <Box mb={8} flexDirection="column" align="center" justify="center" py={8}>
        <Heading as="h1" size="2xl" mb={8}>
          Rick and Morty
        </Heading>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const results = await fetch("/api/SearchCharacters", {
              method: "post",
              body: search,
            });
            const { characters, error } = await results.json();
            if (error) {
              toast({
                position: "top",
                title: "Character not found",
                description: error,
                status: "error",
                duration: 4000,
                isClosable: true,
              });
            } else {
              setCharacters(characters);
            }
          }}
        >
          <Stack justify="center" isInline align="center" mb={12}>
            <Stack maxWidth="350px" width="100%" isInline>
              <Input
                placeholder="Search Characters"
                value={search}
                variant="outline"
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
            </Stack>
            <Stack direction="row">
              <IconButton
                colorScheme="green"
                aria-label="Search characters from the show"
                icon={<SearchIcon />}
                type="submit"
              />
              <IconButton
                colorScheme="red"
                aria-label="Reset "
                icon={<CloseIcon />}
                onClick={async () => {
                  setSearch("");
                  setCharacters(initialData.characters);
                }}
              />
              <IconButton
                icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
                onClick={toggleColorMode}
              />
            </Stack>
          </Stack>
        </form>
        <Character characters={characters} />
      </Box>

      <Stack mb={4}>
        <Text>
          Built with 💗 by{" "}
          <Link
            href="https://github.com/abhijhacodes"
            isExternal
            color="blue.300"
          >
            Abhishek Jha
          </Link>{" "}
        </Text>
      </Stack>
    </Flex>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql/",
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      query {
        characters(page: 1) {
          info {
            count
            pages
          }
          results {
            name
            id
            location {
              name
              id
            }
            image
            origin {
              name
              id
            }
            episode {
              id
              episode
              air_date
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      characters: data.characters.results,
    },
  };
}
