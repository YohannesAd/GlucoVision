import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

/**
 * HamburgerMenu - Navigation menu modal
 * 
 * Features:
 * - Professional dropdown menu design
 * - Navigation options: Account, Add Log, View Logs, AI Trends
 * - Smooth modal animation
 * - Backdrop tap to close
 * - Structured for easy navigation integration
 * 
 * Props:
 * - isVisible: Boolean to control menu visibility
 * - onClose: Function to handle menu close
 * - onNavigate: Function to handle navigation with screen parameter
 */

interface MenuItem {
  id: string;
  title: string;
  icon: string;
}

interface HamburgerMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

export default function HamburgerMenu({ isVisible, onClose, onNavigate }: HamburgerMenuProps) {
  // Menu items configuration
  const menuItems: MenuItem[] = [
    { id: 'account', title: 'Account', icon: '👤' },
    { id: 'addLog', title: 'Add Log', icon: '➕' },
    { id: 'viewLogs', title: 'View Logs', icon: '📊' },
    { id: 'aiTrends', title: 'AI Trends', icon: '🤖' },
  ];

  const handleMenuItemPress = (screenId: string) => {
    onClose();
    onNavigate(screenId);
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        className="flex-1 bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Menu Container */}
        <View className="absolute top-20 right-6 bg-white rounded-xl shadow-lg border border-gray-100 min-w-48">
          {/* Menu Header */}
          <View className="px-4 py-3 border-b border-gray-100">
            <Text className="text-lg font-bold text-darkBlue">Menu</Text>
          </View>
          
          {/* Menu Items */}
          <View className="py-2">
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleMenuItemPress(item.id)}
                className="flex-row items-center px-4 py-3 active:bg-gray-50"
                activeOpacity={0.7}
              >
                <Text className="text-xl mr-3">{item.icon}</Text>
                <Text className="text-base font-medium text-darkBlue flex-1">
                  {item.title}
                </Text>
                <Text className="text-textSecondary">›</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Close Button */}
          <View className="px-4 py-3 border-t border-gray-100">
            <TouchableOpacity
              onPress={onClose}
              className="py-2"
            >
              <Text className="text-center text-textSecondary font-medium">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
