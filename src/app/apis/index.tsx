import { db } from "@/lib/firebase";
import Process from "@/types/process";
import Product, { ProductOffChain } from "@/types/product";
import Supplier from "@/types/supplier";
import { addDoc, collection, doc, DocumentData, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";

/**
 * Get all Supplier from fire store
 * @returns {Promise} - Promise<Supplier[]>
 * */
export const getAllSupplier = async (): Promise<Supplier[]> => {
  const suppliers: Supplier[] = [];
  const supplierRef = collection(db, "supplier");
  await getDocs(supplierRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        suppliers.push({
          id: doc.id,
          name: doc.data().name,
          address: doc.data().address,
          phoneNumber: doc.data().phone,
          email: doc.data().email,
          account: doc.data().account,
          productsProcesses: doc.data().productsProcesses,
          type: doc.data().type,
          taxCode: doc.data().taxCode,
          website: doc.data().website,
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
      return [];
    });
  return suppliers;
};

/**
 * Get Supplier by id
 * @param id - string
 * @returns - Promise<Supplier | null>
 */
export const getSupplierById = async (id: string): Promise<Supplier | null> => {
  let supplier: Supplier | null = null;
  await getDoc(doc(db, "supplier", id))
    .then((doc) => {
      if (doc.exists()) {
        const { createAt, ...tempUser } = doc.data();
        supplier = { id: doc.id, ...tempUser } as Supplier;
      } else {
        console.log("No such document!");
        return null;
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
      return null;
    });

  return supplier;
};

/**
 * Get all Supplier from fire store
 * @returns {Promise} - Promise<Supplier[]>
 * */
export const getAllProducts = async (): Promise<ProductOffChain[]> => {
  const products: ProductOffChain[] = [];
  const supplierRef = collection(db, "product");
  await getDocs(supplierRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        products.push({
          offChainId: doc.id,
          process: doc.data().process,
          unit: doc.data().unit,
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
      return [];
    });
  return products;
};

/**
 * Get Supplier by id
 * @param id - string
 * @returns - Promise<Supplier | null>
 */
export const getProductById = async (id: string | number): Promise<Product | null> => {
  let product: Product | null = null;
  await getDoc(doc(db, "product", id.toString()))
    .then((doc) => {
      if (doc.exists()) {
        const { createAt, ...tempProduct } = doc.data();
        product = { id: doc.id, ...tempProduct } as Product;
      } else {
        console.log("No such document!");
        return null;
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
      return null;
    });

  return product;
};

/**
 * Create new product in firestore
 * @param product - product
 * @returns {Promise} - Promise<DocumentData>
 */
export const addProduct = async (product: ProductOffChain, id: string): Promise<void> => {
  if (!id) {
    throw new Error("ID is required to add a product");
  }
  const docRef = doc(db, "product", id);
  return await setDoc(docRef, {
    ...product,
    createdAt: serverTimestamp(),
  });
};

/**
 * Create new process in fire store
 * @param process - process
 * @returns {Promise} - Promise<DocumentData>
 */
export const addProcess = async (process: Process): Promise<DocumentData> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = process;
  return await addDoc(collection(db, "product-process"), { ...rest, createdAt: serverTimestamp() });
};

/**
 * Get Process by id
 * @param id - string
 * @returns - Promise<Process | null>
 */
export const getProcessById = async (id: string): Promise<Process | null> => {
  let process: Process | null = null;
  await getDoc(doc(db, "product-process", id))
    .then((doc) => {
      if (doc.exists()) {
        const { createAt, ...tempUser } = doc.data();
        process = { id: doc.id, ...tempUser } as Process;
      } else {
        console.log("No such document!");
        return null;
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
      return null;
    });

  return process;
};

/**
 * Get all Processes from fire store
 * @returns {Promise} - Promise<Process[]>
 * */
export const getAllProcesses = async (): Promise<Process[]> => {
  const processes: Process[] = [];
  const supplierRef = collection(db, "product-process");
  await getDocs(supplierRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        processes.push({
          id: doc.id,
          name: doc.data().name,
          image: doc.data().image,
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
      return [];
    });
  return processes;
};
