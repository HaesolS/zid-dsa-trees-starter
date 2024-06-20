// Import 'Queue' class
const Queue = require("./Queue");

class BinarySearchTree {
  /* represents single node in tree
   can optionally pass in "key", "value", and "pointer" to "parent" node
   if "key" is "null", then object represents empty tree
   if "parent" pointer is "null", then it's root node
   node starts w/ "left" + "right" pointers to their child nodes being "null" */
  constructor(key = null, value = null, parent = null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }

  insert(key, value) {
    if (this.key == null) {
      this.key = key;
      this.value = value;
    }
    /* If tree already exists, then start at root
      + compare it to key that you want to insert;
      If new key < node's key
      then new node needs to live in left-hand branch */
    else if (key < this.key) {
      /* If existing node does not have left child / left pointer = empty,
        then instantiate + insert new node as left child of that node,
        passing "this" as parent */
      if (this.left == null) {
        this.left = new BinarySearchTree(key, value, this);
      }
      /* If node has existing left child,
        then recursively call 'insert()' method so node is added further down tree */
      else {
        this.left.insert(key, value);
      }
    }
    /* If new key > node's key,
      then new node needs to live in right-hand side */
    else {
      if (this.right == null) {
        this.right = new BinarySearchTree(key, value, this);
      }
      else {
        this.right.insert(key, value);
      }
    }
  }

  find(key) {
    /* If item is found at root
      then return that value */
    if (this.key == key) {
      return this.value;
    }
    /* If item you are looking for < root,
      then follow left child;
      If there is existing left child,
      then recursively check its left and/or right child until item is found */
    else if (key < this.key && this.left) {
      return this.left.find(key);
    }
    /* If item you're looking for > root,
      then follow right child;
      If there's existing right child,
      then recursively check its left and/or right child until item is found */
    else if (key > this.key && this.right) {
      return this.right.find(key);
    }
    // Searched tree and item isn't in tree
    else {
      throw new Error('Key Not Found');
    }
  }

  remove(key) {
    if (this.key == key) {
      if (this.left && this.right) {
        const successor = this.right._findMin();
        this.key = successor.key;
        this.value = successor.value;
        successor.remove(successor.key);
      }
      /* If node only has left child,
        then replace node with its left child */
      else if (this.left) {
        this._replaceWith(this.left);
      }
      /* If node only has right child,
        then replace it w/ its right child */
      else if (this.right) {
        this._replaceWith(this.right);
      }
      /* If node has no children
        then remove it + any references to it by calling 'this._replaceWith(null)' */
      else {
        this._replaceWith(null);
      }
    }
    else if (key < this.key && this.left) {
      this.left.remove(key);
    }
    else if (key > this.key && this.right) {
      this.right.remove(key);
    }
    else {
      throw new Error('Key Not Found');
    }
  }

  _replaceWith(node) {
    if (this.parent) {
      if (this == this.parent.left) {
        this.parent.left = node;
      }
      else if (this == this.parent.right) {
        this.parent.right = node;
      }
      if (node) {
        node.parent = this.parent
      }
    }
    else {
      if (node) {
        this.key = node.key;
        this.value = node.value;
        this.left = node.left;
        this.right = node.right;
      }
      else {
        this.key = null;
        this.value = null;
        this.left = null;
        this.right = null;
      }
    }
  }

  _findMin() {
    if (!this.left) {
      return this;
    }
    return this.left._findMin();
  }

// Depth-first search methods

  dfsInOrder(values = []) {
    // Process left node recursively
    if (this.left) {
      values = this.left.dfsInOrder(values);
    }
    // Process current node
    values.push(this.value);
    // Process right node recursively
    if (this.right) {
      values = this.right.dfsInOrder(values);
    }
    return values;
  }

  dfsPreOrder(values = []) {
    // Process current node
    values.push(this.value);
    // Proess left node recursively
    if (this.left) {
      values = this.left.dfsPreOrder(values);
    }
    // Process right node recursively
    if (this.right) {
      values = this.right.dfsPreOrder(values);
    }
    return values;
  }

  dfsPostOrder(values = []) {
    // Process left node recursively
    if (this.left) {
      values = this.left.dfsPostOrder(values);
    }
    // Process right node recursively
    if (this.right) {
      values = this.right.dfsPostOrder(values);
    }
    // Process current node
    values.push(this.value);
    return values;
  }

  //Breadth-first search method

  bfs(tree, values = []) {
    const queue = new Queue();
    /* Start traversal at tree
      + add tree node to queue to kick off BFS */
    queue.enqueue(tree);
    // Remove from queue
    let node = queue.dequeue();
    while (node) {
      // Add value from queue to array
      values.push(node.value);
      if (node.left) {
        // Add left child to queue
        queue.enqueue(node.left);
      }
      if (node.right) {
        // Add right child to queue
        queue.enqueue(node.right);
      }
      node = queue.dequeue();
    }
    return values;
  }

  // Height of BST

  getHeight(currentHeight = 0) {
    /* BASE CASE
      If current node doesn't have left/right child,
      then base case is reached,
      + function can return height */
    if (!this.left && !this.right) {
      return currentHeight;
    }
    /* RECURSIVE CASE:
      Otherwise, compute new height */
    const newHeight = currentHeight + 1;
    /* If there's no left child,
      recurse down right subtree only passing down height of current node */
    if (!this.left) {
      return this.right.getHeight(newHeight);
    }
    /* If there's no right child,
      recurse down left subtree only passing down height of current node */
    if (!this.right) {
      return this.left.getHeight(newHeight);
    }
    /* If both children exist,
      recurse down both subtrees passing down height of current node */
    const leftHeight = this.left.getHeight(newHeight);
    const rightHeight = this.right.getHeight(newHeight);
    // Return greater of left/right subtree heights
    return Math.max(leftHeight, rightHeight);
  }

  // Is it BST? (assuming tree doesn't contain duplicates)

  isBST() {
    // Use existing 'dfsInOrder()' method to traverse tree
    const values = this.dfsInOrder();
    // Check if array returned by in-order DFS is sorted array
    for (let i = 1; i < values.length; i++) {
      // Compare current + previous values
      if (values[i] < values[i-1]) {
        return false;
      }
    }
    return true;
  }

  // 3rd largest node

  findKthLargestValue(k) {
    // Use existing 'dfsInOrder()' method to traverse tree
    const values = this.dfsInOrder();
    const kthIndex = values.length - k;
    // Ensure that index is w/in bounds of array
    if (kthIndex >= 0) {
      return values[kthIndex];
    } else {
      console.error("k value exceeds the size of the BST.");
    }
  }
}
