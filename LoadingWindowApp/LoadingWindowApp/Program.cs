using System;
using System.Drawing;
using System.Windows.Forms;

namespace LoadingWindowApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            // Create a form
            Form form = new Form();
            form.Text = "Loading...";
            form.Size = new Size(300, 300);
            form.StartPosition = FormStartPosition.CenterScreen;
            form.TopMost = true;

            // Add a PictureBox to display the GIF
            PictureBox pictureBox = new PictureBox();
            pictureBox.SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox.Dock = DockStyle.Fill;
            pictureBox.ImageLocation = args.Length > 0 ? args[0] : "loading.gif"; // Path to the GIF can be passed as argument
            form.Controls.Add(pictureBox);

            // Run the form
            Application.Run(form);
        }
    }
}
