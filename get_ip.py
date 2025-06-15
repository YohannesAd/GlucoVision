#!/usr/bin/env python3
"""
GlucoVision IP Address Helper
Automatically finds your computer's IP address for mobile development
"""

import socket
import subprocess
import sys
import platform

def get_local_ip():
    """Get the local IP address of this machine"""
    try:
        # Create a socket connection to determine local IP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            # Connect to a remote address (doesn't actually send data)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            return local_ip
    except Exception:
        return None

def get_ip_from_system():
    """Get IP address using system commands"""
    try:
        system = platform.system().lower()
        
        if system == "windows":
            # Windows: use ipconfig
            result = subprocess.run(
                ["ipconfig"], 
                capture_output=True, 
                text=True, 
                shell=True
            )
            lines = result.stdout.split('\n')
            for line in lines:
                if "IPv4 Address" in line and "192.168." in line:
                    ip = line.split(':')[-1].strip()
                    return ip
                elif "IPv4 Address" in line and "10." in line:
                    ip = line.split(':')[-1].strip()
                    return ip
        else:
            # macOS/Linux: use ifconfig or ip
            try:
                result = subprocess.run(
                    ["ifconfig"], 
                    capture_output=True, 
                    text=True
                )
                lines = result.stdout.split('\n')
                for line in lines:
                    if "inet " in line and ("192.168." in line or "10." in line):
                        parts = line.split()
                        for i, part in enumerate(parts):
                            if part == "inet" and i + 1 < len(parts):
                                ip = parts[i + 1]
                                if ip.startswith("192.168.") or ip.startswith("10."):
                                    return ip
            except FileNotFoundError:
                # Try 'ip' command if ifconfig not available
                result = subprocess.run(
                    ["ip", "route", "get", "1"], 
                    capture_output=True, 
                    text=True
                )
                lines = result.stdout.split('\n')
                for line in lines:
                    if "src" in line:
                        parts = line.split()
                        for i, part in enumerate(parts):
                            if part == "src" and i + 1 < len(parts):
                                return parts[i + 1]
    except Exception as e:
        print(f"Error getting IP from system: {e}")
    
    return None

def main():
    """Main function to display IP address and instructions"""
    print("🌐 GlucoVision IP Address Helper")
    print("=" * 40)
    
    # Try to get IP address
    ip_address = get_local_ip()
    if not ip_address:
        ip_address = get_ip_from_system()
    
    if ip_address:
        print(f"✅ Your computer's IP address: {ip_address}")
        print()
        print("📝 Next steps:")
        print(f"1. Update frontend/src/services/api/config.ts")
        print(f"   Replace 'localhost' with: {ip_address}")
        print()
        print(f"2. Start backend with:")
        print(f"   python run.py --host 0.0.0.0 --port 8000")
        print()
        print(f"3. Access API documentation:")
        print(f"   http://{ip_address}:8000/docs")
        print()
        print(f"4. Test API health:")
        print(f"   curl http://{ip_address}:8000/health")
        
    else:
        print("❌ Could not automatically detect IP address")
        print()
        print("🔧 Manual steps:")
        system = platform.system().lower()
        if system == "windows":
            print("1. Run: ipconfig | findstr IPv4")
        else:
            print("1. Run: ifconfig | grep inet")
        print("2. Look for an address starting with 192.168. or 10.")
        print("3. Update frontend configuration with that IP address")

if __name__ == "__main__":
    main()
