class EdgePath {
  edgePaths = [];

  getEdgePaths() {
    return this.edgePaths;
  }

  getEdgePathIndex(id) {
    if (id) {
      let index = this.edgePaths.findIndex((p) => p.id === id);
      return index !== -1 ? index : null;
    }
    return null;
  }

  setEdgePaths(edgeObj) {
    let { id, smoothedPath, graphPath } = edgeObj || {};
    let edgePathIndex = this.getEdgePathIndex(id);
    if (edgePathIndex !== null) {
      let { smoothedPath: currentESP, graphPath: currentEGP } =
        this.edgePaths[edgePathIndex] || {};
      let updatedESP = smoothedPath ? smoothedPath.toString() : null;
      let updatedEGP = graphPath ? graphPath.toString() : null;

      currentESP = currentESP ? currentESP.toString() : null;
      currentEGP = currentEGP ? currentEGP.toString() : null;

      let isPathNotEmpty = !!(updatedESP && updatedEGP);
      let isPathNotEqual =
        currentESP !== updatedESP && currentEGP !== updatedEGP;

      if (isPathNotEmpty && isPathNotEqual) {
        this.edgePaths.splice(edgePathIndex, 1, {
          id,
          smoothedPath,
          graphPath
        });
      }
    } else {
      this.edgePaths.push({ id, smoothedPath, graphPath });
    }
  }
}

let edgePaths = new EdgePath();
export { edgePaths };
