import { db } from "@/lib/firebase";
import { OrderFireStore } from "@/types/order";
import Process from "@/types/process";
import Product, { ProductOffChain } from "@/types/product";
import Supplier from "@/types/supplier";
import getDate from "@/utils/getDate";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

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
          role: doc.data().role,
          name: doc.data().name,
          address: doc.data().address,
          phoneNumber: doc.data().phoneNumber,
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
export const getSupplierByAddress = async (id: string): Promise<Supplier | null> => {
  let supplier: Supplier | null = null;
  // get supplier by address (query by address)
  const supplierRef = collection(db, "supplier");
  const supplierQuery = query(supplierRef, where("account", "==", id));
  const result = await getDocs(supplierQuery);
  result.forEach((doc) => {
    supplier = {
      id: doc.id,
      role: doc.data().role,
      name: doc.data().name,
      address: doc.data().address,
      phoneNumber: doc.data().phone,
      email: doc.data().email,
      account: doc.data().account,
      productsProcesses: doc.data().productsProcesses,
      type: doc.data().type,
      taxCode: doc.data().taxCode,
      website: doc.data().website,
    };
  });
  console.log("🚀 ~ getSupplierByAddress ~ supplier:", supplier);

  return supplier;
};

/**
 * Update supplier to firestore
 * @param supplier - Supplier
 * @returns {Promise} - Promise<DocumentData>
 */
export const updateSupplier = async (supplier: Supplier): Promise<void> => {
  const userDocRef = doc(db, "supplier", supplier.id); 
  await updateDoc(userDocRef, {...supplier}); 
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
 * Add new supplier to firestore
 * @param supplier - Supplier
 * @returns {Promise} - Promise<DocumentData>
 */
export const addSupplier = async (supplier: Supplier): Promise<DocumentData> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = supplier;
  return await addDoc(collection(db, "supplier"), { ...rest });
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
        console.log("🚀 ~ .then ~ createAt:", createAt);
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
export const addProcess = async (process: Partial<Process>): Promise<DocumentData> => {
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
        console.log("🚀 ~ .then ~ createAt:", createAt);
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
          description: doc.data().description,
          date: getDate(
            new Date(doc.data().createdAt.seconds * 1000 + doc.data().createdAt.nanoseconds / 1e6).getTime()
          ),
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
      return [];
    });
  return processes;
};

/**
 * Get all Orders from fire store
 */
export const getAllOrders = async (): Promise<OrderFireStore[]> => {
  const orders: OrderFireStore[] = [];
  const supplierRef = collection(db, "order");
  await getDocs(supplierRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data(),
        } as OrderFireStore);
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
      return [];
    });
  return orders;
};

/**
 * Add new order to fire store
 * @param order - Order
 * @param id - string
 * @returns {Promise} - Promise<void>
 */
export const addOrder = async (order: OrderFireStore, id: string): Promise<void> => {
  if (!id) {
    throw new Error("ID is required to add a product");
  }
  const docRef = doc(db, "order", id);
  return await setDoc(docRef, {
    ...order,
    createdAt: serverTimestamp(),
  });
};
