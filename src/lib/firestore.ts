import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore"
import { db } from "./firebase"

export type ProgressItem = {
  id: string
  label: string
  percentage: number
  color: string
  image: string | null
  current: number
  goal: number
}

export type ProgressWidget = {
  id?: string
  name: string
  items: ProgressItem[]
  userId: string
  createdAt: string
  updatedAt: string
  embedViews: number
}

// Create a new widget
export async function createWidget(widget: Omit<ProgressWidget, "id" | "createdAt" | "updatedAt" | "embedViews">) {
  const now = new Date().toISOString()
  const docRef = await addDoc(collection(db, "widgets"), {
    ...widget,
    createdAt: now,
    updatedAt: now,
    embedViews: 0,
  })
  return docRef.id
}

// Get all widgets for a user
export async function getUserWidgets(userId: string): Promise<ProgressWidget[]> {
  const q = query(collection(db, "widgets"), where("userId", "==", userId), orderBy("createdAt", "desc"))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as ProgressWidget,
  )
}

// Get a specific widget
export async function getWidget(widgetId: string): Promise<ProgressWidget | null> {
  const docRef = doc(db, "widgets", widgetId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as ProgressWidget
  }
  return null
}

// Update a widget
export async function updateWidget(widgetId: string, updates: Partial<ProgressWidget>) {
  const docRef = doc(db, "widgets", widgetId)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

// Delete a widget
export async function deleteWidget(widgetId: string) {
  const docRef = doc(db, "widgets", widgetId)
  await deleteDoc(docRef)
}

// Increment embed views
export async function incrementEmbedViews(widgetId: string) {
  const widget = await getWidget(widgetId)
  if (widget) {
    await updateWidget(widgetId, {
      embedViews: widget.embedViews + 1,
    })
  }
}
