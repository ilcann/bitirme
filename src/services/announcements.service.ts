import { MockAnnouncements } from "@/mock/announcements";
import type { AudienceKey } from "@/config/audiences";
import type { Announcement } from "@/types/announcement";

/**
 * Announcements Service
 * Handles all announcement-related API operations
 * Currently uses mock data, ready for API integration
 */

/**
 * Get all announcements
 */
export const getAllAnnouncements = async (): Promise<Announcement[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return MockAnnouncements;
};

/**
 * Get announcements filtered by audience
 */
export const getAnnouncementsByAudience = async (audience: AudienceKey): Promise<Announcement[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return MockAnnouncements.filter(announcement => announcement.audience === audience);
};

/**
 * Get a single announcement by ID
 */
export const getAnnouncementById = async (announcementId: string): Promise<Announcement | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return MockAnnouncements.find(announcement => announcement.id === announcementId) || null;
};

/**
 * Get announcements for a specific course
 */
export const getAnnouncementsByCourseId = async (courseId: string): Promise<Announcement[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return MockAnnouncements.filter(announcement => announcement.courseId === courseId);
};

/**
 * Get only new announcements
 */
export const getNewAnnouncements = async (audience?: AudienceKey): Promise<Announcement[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let announcements = MockAnnouncements.filter(announcement => announcement.isNew);
    
    if (audience) {
        announcements = announcements.filter(announcement => announcement.audience === audience);
    }
    
    return announcements;
};

/**
 * Search announcements by query
 */
export const searchAnnouncements = async (
    query: string,
    audience?: AudienceKey
): Promise<Announcement[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let announcements = MockAnnouncements;
    
    // Filter by audience if provided
    if (audience) {
        announcements = announcements.filter(announcement => announcement.audience === audience);
    }
    
    // Search in title, description, and courseId
    if (query.trim()) {
        const searchQuery = query.toLowerCase();
        announcements = announcements.filter(announcement => 
            announcement.title.tr.toLowerCase().includes(searchQuery) ||
            announcement.title.en.toLowerCase().includes(searchQuery) ||
            announcement.description.tr.toLowerCase().includes(searchQuery) ||
            announcement.description.en.toLowerCase().includes(searchQuery) ||
            announcement.courseId.toLowerCase().includes(searchQuery)
        );
    }
    
    return announcements;
};
