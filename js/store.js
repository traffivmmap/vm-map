export class MultiMap extends Map {
  insert(key, value) {
    if (key === null || key === undefined) {
      throw new TypeError("MultiMap: key cannot be null or undefined");
    }

    // Validate value
    if (value === null || value === undefined) {
      throw new TypeError("MultiMap: value cannot be null or undefined");
    }
    if (!this.has(key)) {
      this.set(key, new Set());
    }
  // Check if value is iterable (Array, Set, etc.), but NOT a string
  if (typeof value !== "string" && Symbol.iterator in Object(value)) {
    for (const v of value) {
      this.get(key).add(v);
    }
  } else {
    this.get(key).add(value);
  }

  }

  remove(key, value) {
    if (!this.has(key)) return; // nothing to remove

    // If value is iterable (Array, Set, etc.) but NOT a string
    if (typeof value !== "string" && Symbol.iterator in Object(value)) {
      for (const v of value) {
        this.get(key).delete(v);
      }
    } else {
      this.get(key).delete(value);
    }
  }
}

export const mappings = {
  alternativeRouteIdToSidebarEntry: new MultiMap(),
  measureIdToMarkers: new Map(),
  measureIdToSidebarEntry: new MultiMap(),
  categoryGroupToMeasureId: new Map(),
  categoryGroupToAlternativeRouteID: new MultiMap(),
  layerIdToHiddenFeatureIds: new MultiMap(),
};

