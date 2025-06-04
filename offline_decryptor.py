import asyncio
import os
from io import BytesIO
from tkinter import Tk, StringVar, filedialog, messagebox
from tkinter import ttk

from app.decryptor import decrypt_file


class DecryptorGUI:
    def __init__(self):
        self.root = Tk()
        self.root.title("Enclypt Offline Decryptor")
        self.root.resizable(False, False)
        style = ttk.Style(self.root)
        try:
            style.theme_use("clam")
        except:
            pass

        pad = {"padx": 8, "pady": 6}

        ttk.Label(self.root, text="Encrypted File:").grid(row=0, column=0, sticky="e", **pad)
        self.file_var = StringVar()
        ttk.Entry(self.root, textvariable=self.file_var, width=40).grid(row=0, column=1, **pad)
        ttk.Button(self.root, text="Browse", command=self.choose_file).grid(row=0, column=2, **pad)

        ttk.Label(self.root, text="Password / Key:").grid(row=1, column=0, sticky="e", **pad)
        self.pass_var = StringVar()
        ttk.Entry(self.root, textvariable=self.pass_var, show="*").grid(row=1, column=1, **pad)

        ttk.Label(self.root, text="Method:").grid(row=2, column=0, sticky="e", **pad)
        self.method_var = StringVar(value="fernet")
        ttk.Combobox(self.root, textvariable=self.method_var, values=["fernet", "aes256", "rsa"], state="readonly").grid(row=2, column=1, sticky="w", **pad)

        ttk.Label(self.root, text="RSA Private Key:").grid(row=3, column=0, sticky="e", **pad)
        self.key_var = StringVar()
        ttk.Entry(self.root, textvariable=self.key_var, width=40).grid(row=3, column=1, **pad)
        ttk.Button(self.root, text="Browse", command=self.choose_key).grid(row=3, column=2, **pad)

        ttk.Button(self.root, text="Decrypt", command=self.run_decrypt).grid(row=4, column=1, pady=12)

    def choose_file(self):
        path = filedialog.askopenfilename()
        if path:
            self.file_var.set(path)

    def choose_key(self):
        path = filedialog.askopenfilename()
        if path:
            self.key_var.set(path)

    def run(self):
        self.root.mainloop()

    def run_decrypt(self):
        file_path = self.file_var.get()
        if not os.path.isfile(file_path):
            messagebox.showerror("Error", "Choose a valid encrypted file")
            return
        password = self.pass_var.get()
        method = self.method_var.get()
        rsa_key = None
        if method == "rsa":
            key_path = self.key_var.get()
            if not os.path.isfile(key_path):
                messagebox.showerror("Error", "RSA key file required")
                return
            with open(key_path, "r") as f:
                rsa_key = f.read()

        async def task():
            with open(file_path, "rb") as f:
                data = f.read()
            src = BytesIO(data)
            src.filename = os.path.basename(file_path)
            try:
                out = await decrypt_file(
                    file=src,
                    password=password,
                    method=method,
                    user_level="paid",
                    rsa_private_key=rsa_key,
                )
            except Exception as e:
                messagebox.showerror("Error", str(e))
                return
            messagebox.showinfo("Success", f"Decrypted file saved to {out}")

        asyncio.run(task())


if __name__ == "__main__":
    DecryptorGUI().run()
