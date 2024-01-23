export const GenerationInput = "Payload that conducts intrusion detection on Windows Registry Access by monitoring MAC ID and IP addresses";

export const GenerationOutput = 
`
import winreg
import socket
import hashlib

def get_mac_address():
    mac = ':'.join(hex(i)[2:].zfill(2) for i in hashlib.md5(socket.gethostname().encode()).digest())
    return mac.upper()

def get_ip_address():
    ip = socket.gethostbyname(socket.gethostname())
    return ip

def monitor_registry_access():
    mac_address = get_mac_address()
    ip_address = get_ip_address()

    # Open the registry key for monitoring
    reg_key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\CurrentControlSet\Control\Network\{4D36E972-E325-11CE-BFC1-08002BE10318}")

    # Get the number of subkeys under the registry key
    num_subkeys = winreg.QueryInfoKey(reg_key)[0]

    # Iterate through each subkey
    for i in range(num_subkeys):
        try:
            # Open the subkey
            subkey_name = winreg.EnumKey(reg_key, i)
            subkey = winreg.OpenKey(reg_key, subkey_name)

            # Get the MAC ID value
            mac_id = winreg.QueryValueEx(subkey, "NetworkAddress")[0]

            # Get the IP address value
            ip = winreg.QueryValueEx(subkey, "IPAddress")[0]

            # Compare the MAC ID and IP address with the current values
            if mac_id != mac_address or ip != ip_address:
                print("Possible intrusion detected!")
                print("MAC ID: ", mac_id)
                print("IP Address: ", ip)
                print("")

            # Close the subkey
            winreg.CloseKey(subkey)
        except Exception as e:
            print("Error accessing registry subkey:", e)

    # Close the registry key
    winreg.CloseKey(reg_key)

# Run the intrusion detection
monitor_registry_access()
`;

export const InterpretationInput = `
GUI SPACE
DELAY 100
STRING terminal.app
DELAY 100
ENTER
DELAY 1000
CTRL c
DELAY 100
STRING cd ~
DELAY 100
ENTER
DELAY 100
GUI CTRL f
DELAY 700
STRING brew install automake cmatrix
DELAY 100
ENTER 
DELAY 20000
STRING cmatrix
DELAY 100
ENTER
`;


export const InterpretationOutput = `
The code is a script that automates a series of actions on a GUI interface. Here is the breakdown of its functionality:

1. GUI SPACE: Presses the space key on the GUI interface.
2. DELAY 100: Waits for 100 milliseconds.
3. STRING terminal.app: Types the string "terminal.app" on the GUI interface.
4. DELAY 100: Waits for 100 milliseconds.
5. ENTER: Presses the enter key on the GUI interface.
6. DELAY 1000: Waits for 1000 milliseconds (1 second).
7. CTRL c: Presses the control (CTRL) key and the c key simultaneously on the GUI interface.
8. DELAY 100: Waits for 100 milliseconds.
9. STRING cd ~: Types the string "cd ~" on the GUI interface.
10. DELAY 100: Waits for 100 milliseconds.
11. ENTER: Presses the enter key on the GUI interface.
12. DELAY 100: Waits for 100 milliseconds.
13. GUI CTRL f: Presses the GUI key and the control (CTRL) key simultaneously on the GUI interface.
14. DELAY 700: Waits for 700 milliseconds.
15. STRING brew install automake cmatrix: Types the string "brew install automake cmatrix" on the GUI interface.
16. DELAY 100: Waits for 100 milliseconds.
17. ENTER: Presses the enter key on the GUI interface.
18. DELAY 20000: Waits for 20000 milliseconds (20 seconds).
19. STRING cmatrix: Types the string "cmatrix" on the GUI interface.
20. DELAY 100: Waits for 100 milliseconds.
21. ENTER: Presses the enter key on the GUI interface.

Overall, the code opens a terminal application, runs a command to install the "cmatrix" program using a package manager called "brew", and then runs the "cmatrix" program.
`;
