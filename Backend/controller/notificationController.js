import Notification from "../model/notificationModel.js";
import { errorHandler } from "../middleware/errorHandler.js";
import ErrorHandler from "../middleware/errorMiddleware.js";

// Send Notification (Admin/Teacher)
export const sendNotification = errorHandler(async (req, res, next) => {
    const { title, message, recipientGroup } = req.body;

    if (!title || !message || !recipientGroup) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const notification = await Notification.create({
        sender: req.user._id,
        title,
        message,
        recipientGroup,
    });

    res.status(201).json({
        success: true,
        message: "Notification sent successfully",
        notification,
    });
});

// Get Notifications for User
export const getMyNotifications = errorHandler(async (req, res, next) => {
    const { role } = req.user;

    // Fetch notifications for 'all' or specifically for the user's role
    const notifications = await Notification.find({
        recipientGroup: { $in: ["all", `${role}s`] }, // logic: if role is student, match 'all' or 'students'
        status: "active",
    }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        notifications,
    });
});

// Delete Notification (Admin only)
export const deleteNotification = errorHandler(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        return next(new ErrorHandler("Notification not found", 404));
    }

    await notification.deleteOne();

    res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
    });
});
