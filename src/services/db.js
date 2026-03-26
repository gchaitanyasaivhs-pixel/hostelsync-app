import { db } from './firebase/config';
import { collection, doc, getDocs, getDoc, runTransaction, query, where, addDoc, serverTimestamp, updateDoc, orderBy } from 'firebase/firestore';

export const getHostels = async () => {
  const q = query(collection(db, 'hostels'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getHostelById = async (id) => {
  const docRef = doc(db, 'hostels', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
  return null;
};

// CRITICAL: Booking transaction with lock
export const bookRoom = async (hostelId, userId) => {
  const hostelRef = doc(db, 'hostels', hostelId);
  const bookingsRef = collection(db, 'bookings');
  
  return await runTransaction(db, async (transaction) => {
    const hostelDoc = await transaction.get(hostelRef);
    if (!hostelDoc.exists()) throw new Error("Hostel does not exist!");
    
    const data = hostelDoc.data();
    if (data.availableRooms <= 0) {
      // Create failure notification
      const userNotifRef = doc(collection(db, 'notifications'));
      transaction.set(userNotifRef, {
        userId,
        message: `Booking failed for ${data.name}: No rooms available.`,
        type: 'booking_failed',
        isRead: false,
        createdAt: serverTimestamp()
      });
      throw new Error("No rooms available for booking! Room lock rejected.");
    }
    
    // Decrement availability
    transaction.update(hostelRef, { availableRooms: data.availableRooms - 1 });
    
    // Create new booking document 
    const newBookingRef = doc(bookingsRef);
    transaction.set(newBookingRef, {
      hostelId,
      userId,
      status: 'confirmed',
      totalPrice: data.pricePerMonth,
      createdAt: serverTimestamp()
    });

    // Notify User Success
    const userNotifRef = doc(collection(db, 'notifications'));
    transaction.set(userNotifRef, {
      userId,
      message: `Your booking at ${data.name} is confirmed!`,
      type: 'booking_success',
      isRead: false,
      createdAt: serverTimestamp()
    });
    
    return true;
  });
};

export const getUserBookings = async (userId) => {
  const q = query(collection(db, 'bookings'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getReviews = async (hostelId) => {
  const q = query(collection(db, 'reviews'), where('hostelId', '==', hostelId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addReview = async (hostelId, userId, userName, rating, comment) => {
  await addDoc(collection(db, 'reviews'), {
    hostelId, userId, userName, rating, comment, createdAt: serverTimestamp()
  });
  
  // Aggregate rating tracking
  const hostelRef = doc(db, 'hostels', hostelId);
  const hostelDoc = await getDoc(hostelRef);
  if (hostelDoc.exists()) {
     const data = hostelDoc.data();
     const newCount = (data.reviewCount || 0) + 1;
     const newAvg = (((data.averageRating || 0) * (data.reviewCount || 0)) + rating) / newCount;
     await updateDoc(hostelRef, { reviewCount: newCount, averageRating: newAvg });
  }
};
