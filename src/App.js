import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  const RepoView = ({ id, title, techs, likes }) => (
    <View style={styles.repositoryContainer}>
      <Text style={styles.repository}>{title}</Text>

      <View style={styles.techsContainer}>
        {techs.map((tech) => (
          <Text key={tech} style={styles.tech}>
            {tech}
          </Text>
        ))}
      </View>

      <View style={styles.likesContainer}>
        <Text style={styles.likeText} testID={`repository-likes-${id}`}>
          {likes} curtidas
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLikeRepository(id)}
        testID={`like-button-${id}`}
      >
        <Text style={styles.buttonText}>Curtir</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    api
      .get("repositories")
      .then((resp) => {
        setRepositories(resp.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  async function handleLikeRepository(id) {
    const repoIndex = repositories.findIndex((repo) => repo.id === id);

    const updatedRepo = {
      ...repositories[repoIndex],
      likes: repositories[repoIndex].likes + 1,
    };

    await api.post(`repositories/${id}/like`, updatedRepo);

    const repoList = repositories.map((repo) => {
      if (repo.id === id) return updatedRepo;
      else return repo;
    });

    setRepositories(repoList);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(repo) => repo.id}
          renderItem={({ item: repo }) => RepoView(repo)}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
